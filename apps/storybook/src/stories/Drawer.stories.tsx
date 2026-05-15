import type { Meta, StoryObj } from '@storybook/react';
import {
  Drawer, DrawerTrigger, DrawerContent,
  DrawerHeader, DrawerTitle, DrawerDescription,
  DrawerBody, DrawerFooter,
} from '../../../../packages/components-react/src/molecules/Drawer';
import { Button } from '../../../../packages/components-react/src/atoms/Button';
import { Input } from '../../../../packages/components-react/src/atoms/Input';
import { Field } from '../../../../packages/components-react/src/atoms/Field';

const meta: Meta<typeof Drawer> = {
  title: 'Molecules/Drawer',
  component: Drawer,
  argTypes: {
    children: { table: { disable: true } },
    open: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

/* ---- Bottom (default) ---- */

export const Bottom: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger>
        <Button variant="secondary" size="m">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent direction="bottom">
        <DrawerHeader>
          <DrawerTitle>Edit Profile</DrawerTitle>
          <DrawerDescription>Make changes to your profile. Swipe down to dismiss.</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', maxWidth: 340, margin: '0 auto', width: '100%' }}>
            <Field label="Name"><Input placeholder="John Doe" /></Field>
            <Field label="Email"><Input placeholder="john@example.com" /></Field>
          </div>
        </DrawerBody>
        <DrawerFooter>
          <Button variant="primary" size="m">Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

/* ---- Top ---- */

export const Top: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger>
        <Button variant="secondary" size="m">Open Top</Button>
      </DrawerTrigger>
      <DrawerContent direction="top">
        <DrawerHeader>
          <DrawerTitle>Notification</DrawerTitle>
          <DrawerDescription>You have 3 unread messages. Swipe up to dismiss.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button variant="primary" size="s">View All</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

/* ---- Right ---- */

export const Right: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger>
        <Button variant="secondary" size="m">Open Right</Button>
      </DrawerTrigger>
      <DrawerContent direction="right">
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>Drag left to dismiss.</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <Field label="Theme"><Input placeholder="System" /></Field>
            <Field label="Language"><Input placeholder="English" /></Field>
          </div>
        </DrawerBody>
        <DrawerFooter>
          <Button variant="primary" size="m">Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

/* ---- Scrollable ---- */

export const Scrollable: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger>
        <Button variant="secondary" size="m">Terms</Button>
      </DrawerTrigger>
      <DrawerContent direction="bottom">
        <DrawerHeader>
          <DrawerTitle>Terms of Service</DrawerTitle>
          <DrawerDescription>Scroll to read. Swipe down to dismiss.</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          {Array.from({ length: 10 }, (_, i) => (
            <p key={i} style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-sm)', color: 'var(--muted-foreground)', marginBottom: 'var(--spacing-4)' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
            </p>
          ))}
        </DrawerBody>
        <DrawerFooter>
          <Button variant="primary" size="m">Accept</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

/* ---- All Directions ---- */

export const AllDirections: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
      {(['bottom', 'top', 'left', 'right'] as const).map((dir) => (
        <Drawer key={dir}>
          <DrawerTrigger>
            <Button variant="secondary" size="s">
              {dir.charAt(0).toUpperCase() + dir.slice(1)}
            </Button>
          </DrawerTrigger>
          <DrawerContent direction={dir}>
            <DrawerHeader>
              <DrawerTitle>Drawer from {dir}</DrawerTitle>
              <DrawerDescription>Drag to dismiss.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button variant="secondary" size="s">Close</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  ),
};
