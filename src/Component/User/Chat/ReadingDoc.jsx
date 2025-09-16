import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
import React, {useCallback} from 'react';
import Markdown from 'react-native-markdown-display';
import MathView, {MathText} from 'react-native-math-view';

const ReadingDoc = React.memo(({content}) => {
  if (!content) return null;

  // Match display math: \[...\] or $$...$$
  const displayMathRegex = /(\\\[.*?\\\]|\$\$.*?\$\$)/gs;
  // Match inline math: \(...\) or $...$
  const inlineMathRegex = /(\\\(.*?\\\)|\$[^$\n]+\$)/g;

  const parseContent = useCallback(rawContent => {
    const parts = [];
    let lastIndex = 0;

    const matches = [...rawContent.matchAll(displayMathRegex)];
    matches.forEach((match, index) => {
      const before = rawContent.slice(lastIndex, match.index);
      if (before.trim()) {
        // Handle inline math within text before display math
        const inlineParts = before.split(inlineMathRegex);
        inlineParts.forEach((sub, i) => {
          if (sub.match(inlineMathRegex)) {
            parts.push({
              type: 'inline-math',
              content: sub,
              key: `inline-${index}-${i}`,
            });
          } else if (sub.trim()) {
            parts.push({type: 'text', content: sub, key: `text-${index}-${i}`});
          }
        });
      }

      parts.push({
        type: 'display-math',
        content: match[0],
        key: `display-${index}`,
      });
      lastIndex = match.index + match[0].length;
    });

    // Remaining content after last match
    const remaining = rawContent.slice(lastIndex);
    if (remaining.trim()) {
      const inlineParts = remaining.split(inlineMathRegex);
      inlineParts.forEach((sub, i) => {
        if (sub.match(inlineMathRegex)) {
          parts.push({
            type: 'inline-math',
            content: sub,
            key: `inline-end-${i}`,
          });
        } else if (sub.trim()) {
          parts.push({type: 'text', content: sub, key: `text-end-${i}`});
        }
      });
    }

    return parts;
  }, []);

  const convertLatexToMarkdown = useCallback(latexContent => {
    let md = latexContent;
    md = md.replace(/\\section\*?\{([^}]+)\}/g, '## $1');
    md = md.replace(/\\textbf\{([^}]+)\}/g, '**$1**');
    md = md.replace(/\\emph\{([^}]+)\}/g, '*$1*');
    md = md.replace(/\\textit\{([^}]+)\}/g, '*$1*');
    md = md.replace(/\\begin\{itemize\}|\\end\{itemize\}/g, '');
    md = md.replace(/\\begin\{enumerate\}|\\end\{enumerate\}/g, '');
    md = md.replace(/\\item\s+/g, '- ');
    md = md.replace(/\\text\{([^}]+)\}/g, '$1');
    md = md.replace(/\\quad/g, '    ');
    md = md.replace(/\\\\(?:\[[^\]]*\])?/g, '\n');
    md = md.replace(/\\vspace\{[^}]+\}/g, '\n\n');
    return md;
  }, []);

  const contentParts = parseContent(content);

  return (
    <View style={styles.container}>
      {contentParts.map(part => {
        if (part.type === 'display-math') {
          const math = part.content
            .replace(/^\\\[|\\\]$/g, '')
            .replace(/^\$\$|\$\$$/g, '');
          return (
            <TouchableWithoutFeedback key={part.key}  >
                <View style={styles.mathContainer}>
                  <MathView math={math.trim()} style={styles.math} />
                </View>
              </TouchableWithoutFeedback>
          );
        } else if (part.type === 'inline-math') {
          const math = part.content
            .replace(/^\\\(|\\\)$/g, '')
            .replace(/^\$|\$$/g, '');
          return (
             <TouchableWithoutFeedback key={part.key}  >
                <View style={styles.inlineMathContainer}>
                  <MathText
                    value={`\\(${math.trim()}\\)`}
                    style={styles.mathText}
                  />
                </View>
              </TouchableWithoutFeedback>
          );
        } else {
          const md = convertLatexToMarkdown(part.content);
          return ( 
             <TouchableWithoutFeedback key={part.key}  >
                <View>
                  <Markdown style={styles.markdown}>{md}</Markdown>
                </View>
              </TouchableWithoutFeedback>
          );
        }
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
  },
  markdown: {
    text: {
      fontSize: 17,
      lineHeight: 24,
      color: '#000',
    },
  },
  mathContainer: {
    alignItems: 'center',
    marginVertical: 5,
  },
  math: {
    // backgroundColor: "red",
    fontSize: 17,
    lineHeight: 24,
  },
  inlineMathContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mathText: {
    fontSize: 17,
    lineHeight: 24,
    color: 'black',
    // backgroundColor: "green",
    textAlign: 'center',
  },
});

export default ReadingDoc;
