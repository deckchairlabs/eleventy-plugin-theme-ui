import emotion from 'emotion';
import JSON5 from 'json5';
import { JSDOM } from 'jsdom';
import MarkdownIt from 'markdown-it';
import createEmotionServer from 'create-emotion-server';
//@ts-ignore
import { css as cssx, get } from '@theme-ui/css';
import { SystemStyleObject, UseThemeFunction } from '@styled-system/css';
import { Theme } from 'theme-ui';

type Options = {
  theme: Theme;
};

const defaultOptions: Options = {
  theme: {},
};

const SX_ATTRIBUTE = 'sx';
const CSS_ATTRIBUTE = 'css';
const VARIANT_ATTRIBUTE = 'variant';

export function applyStyles(
  sx: Exclude<SystemStyleObject, UseThemeFunction> & { variant: string },
  css = {},
  theme: Theme
) {
  if (sx) {
    const { variant, ...baseStyles } = sx;
    const variantStyles = cssx(get(theme, variant))({ theme });

    const mergedStyles = {
      ...variantStyles,
      ...cssx(baseStyles)({ theme }),
      ...css,
    };

    return emotion.css(mergedStyles);
  }

  return undefined;
}

export default function plugin(
  eleventyConfig: any,
  options: Options = defaultOptions
) {
  const { theme } = options;

  const markdown = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
  });

  const originalRenderAttrs = markdown.renderer.renderAttrs;
  markdown.renderer.renderAttrs = function renderAttrs(token) {
    if (token.tag) {
      const styleVariant: string = `styles.${token.tag}`;
      const className = applyStyles({ variant: styleVariant }, {}, theme);

      if (className) {
        token.attrJoin('class', className);
      }
    }
    return originalRenderAttrs(token);
  };

  eleventyConfig.setLibrary('md', markdown);

  eleventyConfig.addTransform('theme-ui', function(
    content: string,
    outputPath: string
  ) {
    if (outputPath && outputPath.endsWith('.html')) {
      // Check if we should inject root/global styles
      if (theme.useBodyStyles === true || (theme.styles && theme.styles.root)) {
        const boxSizing =
          theme.useBorderBox === false ? undefined : 'border-box';
        // Inject global styles
        emotion.injectGlobal(
          cssx({
            '*': {
              boxSizing,
            },
            body: {
              margin: 0,
              variant: 'styles.root',
            },
          })({ theme })
        );
      }

      const initialDOM = new JSDOM(content);
      const elements = initialDOM.window.document.querySelectorAll(
        `[${SX_ATTRIBUTE}], [${CSS_ATTRIBUTE}], [${VARIANT_ATTRIBUTE}]`
      );

      elements.forEach(element => {
        const sxAttribute = element.getAttribute(SX_ATTRIBUTE);
        const cssAttribute = element.getAttribute(CSS_ATTRIBUTE);
        const variantAttribute = element.getAttribute(VARIANT_ATTRIBUTE);

        const sxAttributeValue = sxAttribute
          ? JSON5.parse(sxAttribute.valueOf())
          : {};
        const cssAttributeValue = cssAttribute
          ? JSON5.parse(cssAttribute.valueOf())
          : {};
        const variantAttributeValue = variantAttribute
          ? variantAttribute.valueOf()
          : undefined;

        element.removeAttribute(SX_ATTRIBUTE);
        element.removeAttribute(CSS_ATTRIBUTE);
        element.removeAttribute(VARIANT_ATTRIBUTE);

        const className = applyStyles(
          {
            variant: variantAttributeValue,
            ...sxAttributeValue,
          },
          cssAttributeValue,
          theme
        );

        if (className) {
          element.className = className;
        }
      });

      const emotionServer = createEmotionServer(emotion.cache);
      const { html, css } = emotionServer.extractCritical(
        initialDOM.serialize()
      );

      const newDOM = new JSDOM(html);

      const styleTag = newDOM.window.document.createElement('style');
      styleTag.innerHTML = css;

      newDOM.window.document.head.append(styleTag);

      return newDOM.serialize();
    }

    return content;
  });
}
