import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
} from '../../../../packages/components-react/src/molecules/Sheet';
import { Button } from '../../../../packages/components-react/src/atoms/Button';
import { Input } from '../../../../packages/components-react/src/atoms/Input';
import { Field } from '../../../../packages/components-react/src/atoms/Field';

const meta: Meta<typeof Sheet> = {
  title: 'Molecules/Sheet',
  component: Sheet,
  argTypes: {
    children: { table: { disable: true } },
    open: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Sheet>;

/* ---- Right (default) ---- */

export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger>
        <Button variant="secondary" size="m">Open Right</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile. Click save when done.
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="Name">
              <Input placeholder="John Doe" />
            </Field>
            <Field label="Email">
              <Input placeholder="john@example.com" type="email" />
            </Field>
            <Field label="Bio">
              <Input placeholder="Tell us about yourself..." />
            </Field>
          </div>
        </SheetBody>
        <SheetFooter>
          <Button variant="primary" size="m">Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/* ---- Left ---- */

export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger>
        <Button variant="secondary" size="m">Open Left</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Browse the app sections.</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {['Home', 'Dashboard', 'Projects', 'Settings', 'Help'].map((item) => (
              <div
                key={item}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--font-size-sm)',
                  cursor: 'pointer',
                }}
              >
                {item}
              </div>
            ))}
          </nav>
        </SheetBody>
      </SheetContent>
    </Sheet>
  ),
};

/* ---- Top ---- */

export const Top: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger>
        <Button variant="secondary" size="m">Open Top</Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Announcement</SheetTitle>
          <SheetDescription>
            We have released a new version. Check the changelog for details.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button variant="primary" size="s">View Changelog</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/* ---- Bottom ---- */

export const Bottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger>
        <Button variant="secondary" size="m">Open Bottom</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Cookie Preferences</SheetTitle>
          <SheetDescription>
            Manage your cookie settings. You can enable or disable different types of cookies.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button variant="secondary" size="m">Decline</Button>
          <Button variant="primary" size="m">Accept All</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/* ---- All Sides ---- */

export const AllSides: Story = {
  render: () => {
    const sides = ['top', 'right', 'bottom', 'left'] as const;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {sides.map((side) => (
          <Sheet key={side}>
            <SheetTrigger>
              <Button variant="secondary" size="s">
                {side.charAt(0).toUpperCase() + side.slice(1)}
              </Button>
            </SheetTrigger>
            <SheetContent side={side}>
              <SheetHeader>
                <SheetTitle>Sheet from {side}</SheetTitle>
                <SheetDescription>This sheet slides in from the {side}.</SheetDescription>
              </SheetHeader>
              <SheetBody>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--muted-foreground)' }}>
                  Content goes here.
                </p>
              </SheetBody>
            </SheetContent>
          </Sheet>
        ))}
      </div>
    );
  },
};

/* ---- No Close Button ---- */

export const NoCloseButton: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Button variant="secondary" size="m">Confirm</Button>
        </SheetTrigger>
        <SheetContent side="right" showCloseButton={false}>
          <SheetHeader>
            <SheetTitle>Are you sure?</SheetTitle>
            <SheetDescription>This action requires confirmation.</SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <Button variant="secondary" size="m" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" size="m" onClick={() => setOpen(false)}>Confirm</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  },
};
