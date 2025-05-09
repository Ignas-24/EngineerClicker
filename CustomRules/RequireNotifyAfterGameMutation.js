export default {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Ensure `this.game.notifyUpdate()` occurs after any direct `this.*` writes",
    },
    messages: {
      missingNotify:
        "Possible error: function contains `this.*` writes without this.game.notifyUpdate().",
    },
    schema: [],
  },

  create(context) {
    let funcNode = null;
    let currentSegments = null;
    const segmentInfo = Object.create(null);

    function isDirectThisWrite(node) {
      if (node.type === "AssignmentExpression") {
        let obj = node.left;
        while (obj && obj.type === "MemberExpression") {
          obj = obj.object;
        }
        return obj && obj.type === "ThisExpression";
      }
      if (node.type === "UpdateExpression") {
        let obj = node.argument;
        while (obj && obj.type === "MemberExpression") {
          obj = obj.object;
        }
        return obj && obj.type === "ThisExpression";
      }
      return false;
    }

    function isNotifyCall(node) {
      if (node.type !== "CallExpression") {
        return false;
      }
      const c = node.callee;
      return (
        c.type === "MemberExpression" &&
        c.property.name === "notifyUpdate" &&
        c.object.type === "MemberExpression" &&
        c.object.object.type === "ThisExpression" &&
        c.object.property.name === "game"
      );
    }

    return {
      onCodePathStart(codePath, node) {
        if (
          node.type === "FunctionDeclaration" ||
          node.type === "FunctionExpression" ||
          node.type === "MethodDefinition"
        ) {
          funcNode = node;
          currentSegments = new Set();
        }
      },

      onCodePathSegmentStart(segment) {
        if (!funcNode) {
          return;
        }
        let pending = false;
        if (segment.prevSegments.length > 0) {
          pending = segment.prevSegments.some(
            (prev) => segmentInfo[prev.id]?.pending,
          );
        }
        segmentInfo[segment.id] = { pending };
        currentSegments.add(segment);
      },

      onCodePathSegmentEnd(segment) {
        if (!funcNode) {
          return;
        }
        currentSegments.delete(segment);
      },

      onUnreachableCodePathSegmentStart(segment) {
        if (!funcNode) {
          return;
        }
        segmentInfo[segment.id] = { pending: false };
        currentSegments.add(segment);
      },

      onUnreachableCodePathSegmentEnd(segment) {
        if (!funcNode) {
          return;
        }
        currentSegments.delete(segment);
      },

      "AssignmentExpression, UpdateExpression, CallExpression"(node) {
        if (!funcNode) {
          return;
        }
        if (isNotifyCall(node)) {
          for (const seg of currentSegments) {
            segmentInfo[seg.id].pending = false;
          }
        } else if (isDirectThisWrite(node)) {
          for (const seg of currentSegments) {
            segmentInfo[seg.id].pending = true;
          }
        }
      },

      onCodePathEnd(codePath, node) {
        if (!funcNode || node.type === "ArrowFunctionExpression") {
          return;
        }
        const bad = codePath.finalSegments.some(
          (seg) => segmentInfo[seg.id]?.pending,
        );
        if (bad) {
          context.report({ node: funcNode, messageId: "missingNotify" });
        }
      },
    };
  },
};
