export default {
    meta: {
        type: "layout",
        docs: {
            description: "Disallow indentation with 5 or more spaces",
        },
        fixable: null, 
        schema: [
            {
                type: "integer",
                minimum: 1,
                description: "Maximum allowed space indentation (default: 4)",
            },
        ],
    },

    create(context) {
        const maxAllowedSpaces = 4; 
        const sourceCode = context.getSourceCode();

        return {
            Program() {
                sourceCode.lines.forEach((line, lineIndex) => {
                    
                    const leadingTabs = (line.match(/[\s]+/)?.[0]?.length)/2 || 0;

                    if (leadingTabs <= maxAllowedSpaces || line.trim().length === 0) {
                        return;
                    }

                    const start = { line: lineIndex + 1, column: 0 };
                    const end = { line: lineIndex + 1, column: leadingTabs };

                    context.report({
                        loc: { start, end },
                        message: `Indentation of ${leadingTabs} spaces exceeds the allowed maximum (${maxAllowedSpaces}).`,
                    });
                });
            },
        };
    },
};