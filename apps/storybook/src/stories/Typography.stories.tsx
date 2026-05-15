import type { Meta, StoryObj } from '@storybook/react';
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyP,
  TypographyLead,
  TypographyLarge,
  TypographySmall,
  TypographyMuted,
  TypographyBlockquote,
  TypographyInlineCode,
  TypographyList,
} from '../../../../packages/components-react/src/atoms/Typography';

const meta: Meta = {
  title: 'Atoms/Typography',
  argTypes: {},
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj;

export const AllPrimitives: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <section>
        <TypographySmall>Heading 1 — 4xl / bold / tight</TypographySmall>
        <TypographyH1>The quick brown fox jumps over the lazy dog</TypographyH1>
      </section>

      <section>
        <TypographySmall>Heading 2 — 3xl / semibold / tight</TypographySmall>
        <TypographyH2>The quick brown fox jumps over the lazy dog</TypographyH2>
      </section>

      <section>
        <TypographySmall>Heading 3 — 2xl / semibold</TypographySmall>
        <TypographyH3>The quick brown fox jumps over the lazy dog</TypographyH3>
      </section>

      <section>
        <TypographySmall>Heading 4 — xl / medium</TypographySmall>
        <TypographyH4>The quick brown fox jumps over the lazy dog</TypographyH4>
      </section>

      <section>
        <TypographySmall>Paragraph — base / regular</TypographySmall>
        <TypographyP>
          The king, seeing how much happier his subjects were, realized the error of
          his ways and repealed the joke tax. The people rejoiced, and the kingdom was
          once again filled with laughter.
        </TypographyP>
      </section>

      <section>
        <TypographySmall>Lead — lg / muted</TypographySmall>
        <TypographyLead>
          A longer description or introductory paragraph that provides context
          for the content below.
        </TypographyLead>
      </section>

      <section>
        <TypographySmall>Large — lg / semibold</TypographySmall>
        <TypographyLarge>Are you absolutely sure?</TypographyLarge>
      </section>

      <section>
        <TypographySmall>Small — sm / medium</TypographySmall>
        <TypographySmall>Email address</TypographySmall>
      </section>

      <section>
        <TypographySmall>Muted — sm / muted</TypographySmall>
        <TypographyMuted>Enter your email address.</TypographyMuted>
      </section>

      <section>
        <TypographySmall>Blockquote</TypographySmall>
        <TypographyBlockquote>
          After all, everyone enjoys a good joke, and few are able to resist
          the urge to tell one.
        </TypographyBlockquote>
      </section>

      <section>
        <TypographySmall>Inline Code</TypographySmall>
        <TypographyP>
          Use <TypographyInlineCode>@atom-uikit/css</TypographyInlineCode> to install the CSS package.
        </TypographyP>
      </section>

      <section>
        <TypographySmall>List</TypographySmall>
        <TypographyList>
          <li>First item in the list</li>
          <li>Second item with more detail</li>
          <li>Third item to round it out</li>
        </TypographyList>
      </section>
    </div>
  ),
};

export const Headings: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TypographyH1>Heading 1</TypographyH1>
      <TypographyH2>Heading 2</TypographyH2>
      <TypographyH3>Heading 3</TypographyH3>
      <TypographyH4>Heading 4</TypographyH4>
    </div>
  ),
};

export const BodyVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <TypographyLead>Lead paragraph — used for introductions</TypographyLead>
      <TypographyP>Default paragraph — the workhorse of body text</TypographyP>
      <TypographyLarge>Large text — emphasis without heading weight</TypographyLarge>
      <TypographySmall>Small text — labels and metadata</TypographySmall>
      <TypographyMuted>Muted text — secondary information</TypographyMuted>
    </div>
  ),
};

export const TypeScale: Story = {
  name: 'Major Third Scale',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[
        { cls: 'display-xl', label: '6xl — 76px', text: 'Display XL' },
        { cls: 'display-lg', label: '5xl — 61px', text: 'Display Large' },
        { cls: 'h1', label: '4xl — 49px', text: 'Heading 1' },
        { cls: 'h2', label: '3xl — 39px', text: 'Heading 2' },
        { cls: 'h3', label: '2xl — 31px', text: 'Heading 3' },
        { cls: 'h4', label: 'xl — 25px', text: 'Heading 4' },
        { cls: 'h5', label: 'lg — 20px', text: 'Heading 5' },
        { cls: 'body', label: 'base — 16px', text: 'Body' },
        { cls: 'body-sm', label: 'sm — 13px', text: 'Body Small' },
        { cls: 'caption', label: 'sm — 13px', text: 'Caption' },
        { cls: 'label', label: 'xs — 10px', text: 'LABEL' },
      ].map((step) => (
        <div key={step.cls} style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <span style={{ fontSize: 10, color: 'var(--muted-foreground)', width: 100, flexShrink: 0, textAlign: 'right' }}>
            {step.label}
          </span>
          <span className={step.cls}>{step.text}</span>
        </div>
      ))}
    </div>
  ),
};
