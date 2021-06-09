import {
  Link as ChakraLink,
  Text,
  Code,
  List,
  ListIcon,
  Field,
  ListItem,
} from '@chakra-ui/react'
import { CheckCircleIcon, LinkIcon } from '@chakra-ui/icons'

import { Hero } from '../components/Hero'
import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { CTA } from '../components/CTA'
import { Footer } from '../components/Footer'
import Form from "../components/molecules/Form/Form.component"

const Index = () => (
  <Container height="100vh">
    <Hero />
    <Main>
      <Form
        formInputs={[
          {
            name: "username",
            title: "Username",
            otherTextInputProps: {
              autoComplete: "username"
            },
          },
          {
            name: "password",
            title: "Password",
            placeholder: "Min lenght 8 chars",
            type: "password",
            otherTextInputProps: {
              autoComplete: "current-password"
            },
            registerOptions: {
              required: "Required",
              minLength: { value: 4, message: "Minimum length should be 4" }
            }
          }
        ]}
      />

      <List spacing={3} my={0}>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          <ChakraLink
            isExternal
            href="https://chakra-ui.com"
            flexGrow={1}
            mr={2}
          >
            Chakra UI <LinkIcon />
          </ChakraLink>
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircleIcon} color="green.500" />
          <ChakraLink isExternal href="https://nextjs.org" flexGrow={1} mr={2}>
            Next.js <LinkIcon />
          </ChakraLink>
        </ListItem>
      </List>
    </Main>

    <DarkModeSwitch />
    <Footer>
      <Text>Next ❤️ Chakra</Text>
    </Footer>
    <CTA />
  </Container>
)

export default Index
