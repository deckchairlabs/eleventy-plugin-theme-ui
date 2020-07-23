import emotion from 'emotion';
import { JSDOM } from 'jsdom';
import MarkdownIt from 'markdown-it';
import createEmotionServer from 'create-emotion-server';
//@ts-ignore
import { css as themedCss } from '@theme-ui/css';
import { Theme } from 'theme-ui';
import { css, SxProp } from './css';
import * as components from './components';

type Options = {
  theme: Theme;
};

const defaultOptions: Options = {
  theme: {},
};

export default function plugin(
  eleventyConfig: any,
  options: Options = defaultOptions
) {
  const { theme } = options;

  /**
   * Universal Shortcodes
   */
  eleventyConfig.addShortcode('sx', function(sx: SxProp) {
    return css(sx, theme);
  });

  eleventyConfig.addShortcode('variant', function(variant: string) {
    return css({ variant }, theme);
  });

  /**
   * Component shortcodes
   */
  eleventyConfig.addPairedShortcode('Box', function(
    children: string,
    props: any
  ) {
    return components.Box(children, { theme, ...props });
  });

  eleventyConfig.addPairedShortcode('Button', function(
    children: string,
    props: any
  ) {
    return components.Button(children, { theme, ...props });
  });

  /**
   * ThemeUI Transformer
   *
   * Extract the generated emotion style tags and append them to the document head.
   */
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
          themedCss({
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

      const emotionServer = createEmotionServer(emotion.cache);
      const { html, css: extractedStyles } = emotionServer.extractCritical(
        content
      );

      const newDOM = new JSDOM(html);

      const styleTag = newDOM.window.document.createElement('style');
      styleTag.innerHTML = extractedStyles;

      newDOM.window.document.head.append(styleTag);

      return newDOM.serialize();
    }

    return content;
  });

  /**
   * Markdown It renderer patch for renderAttrs
   */
  const markdown = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
  });

  const originalRenderAttrs = markdown.renderer.renderAttrs;
  markdown.renderer.renderAttrs = function renderAttrs(token) {
    if (token.tag) {
      const className = css(
        { __themeKey: 'styles', variant: token.tag },
        theme
      );

      if (className) {
        token.attrJoin('class', className);
      }
    }
    return originalRenderAttrs(token);
  };

  eleventyConfig.setLibrary('md', markdown);
}
