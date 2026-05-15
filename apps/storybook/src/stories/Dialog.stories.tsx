import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from '../../../../packages/components-react/src/molecules/Dialog';
import { Button } from '../../../../packages/components-react/src/atoms/Button';
import { Input } from '../../../../packages/components-react/src/atoms/Input';
import { Field } from '../../../../packages/components-react/src/atoms/Field';

const meta: Meta<typeof Dialog> = {
  title: 'Molecules/Dialog',
  component: Dialog,
  argTypes: {
    children: { table: { disable: true } },
    open: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

/* ---- Default ---- */

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger>
        <Button variant="secondary" size="m">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="Name">
              <Input placeholder="John Doe" />
            </Field>
            <Field label="Email">
              <Input placeholder="john@example.com" type="email" />
            </Field>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="primary" size="m">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/* ---- No Close Button ---- */

export const NoCloseButton: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button variant="secondary" size="m">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" size="m" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" size="m" onClick={() => setOpen(false)}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};

/* ---- Scrollable Content ---- */

export const ScrollableContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger>
        <Button variant="secondary" size="m">Terms of Service</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>
            Please read the following terms carefully.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          {Array.from({ length: 12 }, (_, i) => (
            <p key={i} style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-sm)', color: 'var(--muted-foreground)', marginBottom: 16 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris.
            </p>
          ))}
        </DialogBody>
        <DialogFooter sticky>
          <Button variant="primary" size="m">Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/* ---- Destructive ---- */

export const Destructive: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button variant="destructive-primary" size="m">Delete Account</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              This will permanently delete your account and all associated data.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" size="m" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive-primary" size="m" onClick={() => setOpen(false)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};

/* ---- Custom Width ---- */

export const CustomWidth: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger>
        <Button variant="secondary" size="m">Wide Dialog</Button>
      </DialogTrigger>
      <DialogContent className="dialog__content" style={{ maxWidth: 720 }}>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new project.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Project Name">
              <Input placeholder="My Project" />
            </Field>
            <Field label="Slug">
              <Input placeholder="my-project" />
            </Field>
            <Field label="Description" style={{ gridColumn: '1 / -1' }}>
              <Input placeholder="A brief description..." />
            </Field>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="primary" size="m">Create Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
