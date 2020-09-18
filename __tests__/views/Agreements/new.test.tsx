/**
 * @jest-environment jsdom
 */

import React from 'react';
import {createMockClient} from 'mock-apollo-client';
import {ApolloProvider} from '@apollo/client';
import {mount, ReactWrapper} from 'enzyme';

import NewAgreement from '@root/views/Agreements/New';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';

let wrapper: ReactWrapper;

const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;

const navigation = {navigate: jest.fn()};
let mockClient: any;
mockClient = createMockClient();

describe('New Agreement Page', () => {
  beforeEach(() => {
    wrapper = mount(
      <ApolloProvider client={mockClient as any}>
        <ThemeContext.Provider value={currentTheme}>
          <NewAgreement navigation={navigation as any} route={{} as any} />
        </ThemeContext.Provider>
      </ApolloProvider>,
    );
    wrapper.update();
  });

  it('renders successfully.', () => {
    const appHeader = wrapper.find('Memo(AppHeader)');
    expect(appHeader).toHaveLength(1);
    expect(appHeader.find('Text').contains('New Agreement')).toEqual(true);
  });

  it('should have a cancel button.', () => {
    const appHeader = wrapper.find('Memo(AppHeader)');
    expect(appHeader.find('TouchableOpacity').contains('Cancel')).toEqual(true);
  });

  it('should have three templates.', () => {
    expect(wrapper.find('TemplateTile')).toHaveLength(3);
  });
});
