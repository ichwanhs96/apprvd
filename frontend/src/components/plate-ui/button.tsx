// disable next line type checking to ensure React to be inscope and surpress warning from TS type check
// @ts-ignore
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn, withRef } from '@udecode/cn';
import { cva, VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        inlineLink: 'text-base text-primary underline underline-offset-4',
      },
      size: {
        default: 'h-10 px-4 py-2',
        xs: 'h-8 rounded-md px-3',
        sm: 'h-9 rounded-md px-3',
        sms: 'size-9 rounded-md px-0',
        lg: 'h-11 rounded-md px-8',
        icon: 'size-10',
        none: '',
      },
      isMenu: {
        true: 'h-auto w-full cursor-pointer justify-start',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export const Button = withRef<
  'button',
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }
>(({ className, isMenu, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={cn(buttonVariants({ isMenu, variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
