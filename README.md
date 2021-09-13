# Dialob Fill Components for Material UI

## Application Setup

### Dependencies

Add dependency

```
yarn add @dialob/fill-material
```

Following peer dependencies need to be installed:

```json
{
  "@dialob/fill-api": "^1.4.*",
  "@dialob/fill-react": "^3.0.*",
  "@mui/material": "^5.0.0-rc.1",
  "@mui/lab": "^5.0.0-alpha.46",
  "@mui/icons-material": "^5.0.0-rc.1",
  "react-intl": "^5.20.*",
  "react-markdown": "^7.0.*",
  "@date-io/date-fns": "^2.11.*",
  "date-fns": "^2.0.0",
  "react-number-format": "^4.7.*"
}
```

### Dialob component wrapper

One possibility to implement

```ts
import React from 'react';
import {Session as DialobSession } from '@dialob/fill-api';
import {MaterialDialob, DefaultView} from '@dialob/fill-material';
import {Item} from './Item';

export interface DialobProps {
  session: DialobSession | null;
  locale: string;
}

export const Dialob: React.FC<DialobProps> = ({session, locale}) => {
  return (
    session &&
    <MaterialDialob session={session} locale={locale}>
      <DefaultView>
        { items => items.map(id => (<Item id={id} key={id} />))}
      </DefaultView>
    </MaterialDialob>
  );
};
```

`<Item>` is a component that renders an actual fill component depending on item's properties. You have to provide your own depending on application needs. (See example here: https://git.resys.io/dialob/dialob-fill-material-demo/-/blob/master/src/dialob/Item.tsx  (needs better docs))

### Component types

Following components are exported

* `<BooleanCheckbox>` Boolean, checkbox style
* `<BooleanRadio>` Boolean, radiobutton style (Yes/No)
* `<Choice>` Choice dropdown
* `<ChoiceAC>` Choice dropdown with autocomplete
* `<DateField>` Date field
* `<Group>` Group, supports 'columns' optional properties, max 4 columns
* `<MultiChoice>` Multi-choice, checbkox list style
* `<MultiChoiceAC>` Multi-choice, dropdown autocomplete style
* `<Note>` Note
* `<Number>` Number field, boolean prop `integer` controls if decimals are supported or not
* `<Page>` Page
* `<RowGroup>` Row group
* `<Row>` Row for Row group
* `<Text>` Text field
* `<TextBox>` Multi-line text field
* `<TimeField>` Time field
* `<SurveyGroup>` Survey group
* `<Survey>` Survey item. NB! Survey item shouldn't be directly created, it is created by SurveyGroup.
* `<GroupContext>` Group context provider
* `<RowGroupContext>` Rowgroup context provider, contains `rowGroup` attribute for containing row group
* `renderErrors(errors:FillError[])` Helper function to render filling validation errors in unified manner, usable for example `<TextField helperText={}`
` <ErrorHelperText>` Materia's `<FormHelperText>` with filling validation errors. 

(This needs improvement)

### Customising MaterialDialob component

In case of using default MaterialDialob component, errors and descriptions can be overridden using "components props" that currently supports errors and description.   
In case of overriding default MaterialDialob, ConfigContext needs to be used to provide error and description configuration.


#### ConfigContext

Currently supports two kinds of component customisations: 

* errors: Converts fill api errors into a React component that is shown as "helper text".
* description: Converts text used in Dialob "description" option into Markdown-based React component.



Example MaterialDialob with ConfigContext:

```ts

export const MaterialDialob: React.FC<MaterialDialobProps> = ({ session, locale, children, components }) => {
  const errors =  (items: FillError[]) => components?.errors ? components.errors(items) : <DefaultRenderErrors errors={items} />;
  const description = (text: string) => components?.description ? components.description(text) : <MarkdownView text={text} />;
        
  return (
    <ConfigContext.Provider value={{errors, description}} >
      <Session key={session.id} session={session} locale={locale}>
        <IntlProvider locale={session.getLocale() || locale} messages={messages[locale]}>
          {children}
        </IntlProvider>
      </Session>
    </ConfigContext.Provider>
  );
}
```


### Missing features

* Network / service error handling
* Default `<Item>` implementation for convenience
