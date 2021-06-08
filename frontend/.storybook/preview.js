import React from "react";
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import { ChakraProvider } from '@chakra-ui/react'
import theme from "../src/styles/theme"

export const decorators = [
  Story => (
    <RouterContext.Provider
      value={{
        push: () => Promise.resolve(),
        replace: () => Promise.resolve(),
        prefetch: () => Promise.resolve(),
      }}>
      <ChakraProvider resetCSS theme={theme}>
        <Story />
      </ChakraProvider>
    </RouterContext.Provider>
  ),
];


export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
    options: {
      storySort: {
        order: ['Atoms', 'Molecules', 'Organisms', 'Pages'],
      },
    },
  },
}