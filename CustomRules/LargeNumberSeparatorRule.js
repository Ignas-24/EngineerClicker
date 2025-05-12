export default {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Large numbers should be written with underscores for better readability",
    },
    fixable: "code",
    schema: [], // no options
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value === "number" && Math.abs(node.value) >= 1_000) {
          let numStr = context.sourceCode.getText(node);

          // avoid other notations or numbers already with underscores
          if (
            numStr.includes("_") ||
            /^0[xX][\da-fA-F]+$/.test(numStr) || // hex
            /^0[bB][01]+$/.test(numStr) || // binary
            /^0[oO][0-7]+$/.test(numStr) || // octal
            /[eE]/.test(numStr) // scientific
          ) {
            return;
          }

          // check if the number is negative by going through the parent
          let isNegative = false;
          if (
            node.parent &&
            node.parent.type === "UnaryExpression" &&
            node.parent.operator === "-"
          ) {
            isNegative = true;
          }

          const [integerPart, decimalPart] = numStr.split(".");

          // add the underscores
          let formattedInt = "";
          for (
            let i = integerPart.length - 1, count = 0;
            i >= 0;
            i--, count++
          ) {
            formattedInt = integerPart[i] + formattedInt;
            if (count % 3 === 2 && i !== 0) {
              formattedInt = "_" + formattedInt;
            }
          }

          let formattedNumStr = isNegative ? "-" + formattedInt : formattedInt; // used for messages
          let formattedNum = formattedInt; // used for replacement with --fix

          if (decimalPart !== undefined) {
            formattedNumStr += "." + decimalPart;
            formattedNum += "." + decimalPart;
          }
          numStr = isNegative ? "-" + numStr : numStr;

          context.report({
            node,
            message: `Number '${numStr}' should use underscores as digit separators (e.g., ${formattedNumStr}).`,
            fix(fixer) {
              return fixer.replaceText(node, formattedNum);
            },
          });
        }
      },
    };
  },
};
