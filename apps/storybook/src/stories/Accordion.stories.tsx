import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionItem } from '../../../../packages/components-react/src/atoms/Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Atoms/Layout/Accordion',
  component: Accordion,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => (
    <Accordion>
      <AccordionItem title="Is it accessible?" defaultOpen>
        Yes. It adheres to the WAI-ARIA design pattern. Each trigger uses
        aria-expanded and the content animates via CSS grid transitions.
      </AccordionItem>
      <AccordionItem title="Is it styled?">
        Yes. It comes with default styles that match the other components
        in the design system, using semantic tokens for colors and spacing.
      </AccordionItem>
      <AccordionItem title="Is it animated?">
        Yes. The content height animates smoothly using the CSS
        grid-template-rows technique. The chevron rotates 180 degrees.
      </AccordionItem>
    </Accordion>
  ),
};

export const FAQ: Story = {
  render: () => (
    <Accordion>
      <AccordionItem title="What is the ATOM UIKit?">
        A design system for building web applications and landing pages.
        It provides tokens, CSS components, React components, and animations
        that work together to create consistent, accessible interfaces.
      </AccordionItem>
      <AccordionItem title="How do I install it?">
        Install the packages you need from npm: @atom-uikit/tokens for
        design tokens, @atom-uikit/css for styles, and
        @atom-uikit/components-react for React components.
      </AccordionItem>
      <AccordionItem title="Does it support dark mode?">
        Yes. All components use semantic tokens that automatically adapt
        when you set data-theme="dark" on the html element.
      </AccordionItem>
      <AccordionItem title="Can I customize the tokens?">
        Yes. Override CSS custom properties in your own stylesheet to
        change colors, spacing, typography, and other design decisions
        without modifying the source packages.
      </AccordionItem>
    </Accordion>
  ),
};
