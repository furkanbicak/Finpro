const fs = require('fs-extra');

const importStatements = [
  "import React from 'react';",
  "import { createComponent } from '@lit-labs/react';",
];

function writeFinproReactFile(fileContentParts) {
  let fileContentText = `
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-nocheck
    ${importStatements.join('\n')}
    ${fileContentParts.join('\n\n')}
  `;

  fs.writeFileSync(`${__dirname}/../src/finpro-react.ts`, fileContentText.trim());
}

function getReactEventName(finproEventName) {
  const rawEventName = finproEventName.match(/(\w+)/g).at(-1);
  return `on${rawEventName[0].toUpperCase()}${rawEventName.slice(1)}`;
}

const customElements = fs.readJSONSync(`${__dirname}/../dist/custom-elements.json`);
const customElementsModules = customElements.modules;
const finproReactFileParts = [];

for (const module of customElementsModules) {
  const { declarations, path } = module;
  const componentDeclaration = declarations.find(declaration => declaration.customElement === true);

  const { events, name: componentName, tagName: fileName } = componentDeclaration;

  const eventNames = events
    ? events.reduce((acc, curr) => {
        acc[getReactEventName(curr.name)] = curr.name;
        return acc;
      }, {})
    : {};

  const importPath = path.replace(/^src\//, '').replace(/\.ts$/, '');
  const Type = componentName + 'Type';

  importStatements.push(`import type ${Type} from "./${importPath}";`);

  finproReactFileParts.push(
    `
  export const ${componentName} = React.lazy(() =>
    customElements.whenDefined('${fileName}').then(elem => ({
        default: createComponent<${Type}>(
          {
            react: React,
            tagName: '${fileName}',
            elementClass: elem,
            events:${JSON.stringify(eventNames)}
          }
      )
      })
 ));
   `
  );
}

writeFinproReactFile(finproReactFileParts);
