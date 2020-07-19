import emotion from 'emotion';
import JSON5 from 'json5';
import { JSDOM } from 'jsdom';
import createEmotionServer from 'create-emotion-server';
//@ts-ignore
import { css as cssx, get } from '@theme-ui/css';
import { SystemStyleObject, UseThemeFunction } from '@styled-system/css';
import { Theme } from 'theme-ui';

type Options = {
  themePath: string;
};

const SX_ATTRIBUTE = 'sx';
const CSS_ATTRIBUTE = 'css';
const VARIANT_ATTRIBUTE = 'variant';

let theme: Theme;

export default function plugin(
  eleventyConfig: any,
  options: Partial<Options> = {}
) {
  const { themePath } = options;

  if (!themePath) {
    throw new Error('No themePath was specified.');
  }

  const resolvedThemePath = require.resolve(themePath, {
    paths: [process.cwd()],
  });

  eleventyConfig.addWatchTarget(resolvedThemePath);
  theme = require(resolvedThemePath);

  function applyStyles(
    sx: Exclude<SystemStyleObject, UseThemeFunction> & { variant: string },
    css = {}
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

  eleventyConfig.on('beforeWatch', function() {
    delete require.cache[resolvedThemePath];
    theme = require(resolvedThemePath);
  });

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
          cssAttributeValue
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
