export default `
# Card filter evaluator

Determine which, if any, of the given card objects match the given filter description.

filter: "$QUERY"

## Output
Return **only** a json array of card ids. If no cards match, return an empty list (\`[]\`).

===

Cards:
\`\`\`
$CARDS
\`\`\`
`;