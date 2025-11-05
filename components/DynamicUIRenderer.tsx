
import React from 'react';
import type { GenerativeUI } from '../types';

// --- Pre-defined, safe components ---

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}
const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={`bg-gray-700 p-4 rounded-lg shadow-md border border-gray-600 ${className || ''}`}>
    {children}
  </div>
);

interface UserProfileProps {
    name: string;
    title: string;
    avatarUrl: string;
}
const UserProfile: React.FC<UserProfileProps> = ({ name, title, avatarUrl }) => (
    <Card className="flex items-center gap-4">
        <img src={avatarUrl} alt={name} className="w-16 h-16 rounded-full border-2 border-cyan-400" />
        <div>
            <h4 className="text-lg font-bold text-white">{name}</h4>
            <p className="text-sm text-gray-300">{title}</p>
        </div>
    </Card>
);

// Whitelist of allowed component types to prevent rendering arbitrary elements.
const componentMap: { [key: string]: React.ElementType } = {
  div: 'div',
  p: 'p',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  span: 'span',
  strong: 'strong',
  em: 'em',
  ul: 'ul',
  li: 'li',
  button: 'button',
  img: 'img',
  Card: Card,
  UserProfile: UserProfile,
};

interface DynamicUIRendererProps {
  schema: GenerativeUI;
}

export const DynamicUIRenderer: React.FC<DynamicUIRendererProps> = ({ schema }) => {
  if (!schema || !schema.type) {
    return null;
  }
  
  const Component = componentMap[schema.type];
  
  if (!Component) {
    console.warn(`DynamicUIRenderer: Component type "${schema.type}" is not allowed.`);
    return <div className="text-red-400">[Unsupported UI Component: {schema.type}]</div>;
  }

  const { children, ...props } = schema.props || {};

  const renderedChildren = schema.children?.map((child, index) => {
    if (typeof child === 'string') {
      return child;
    }
    return <DynamicUIRenderer key={index} schema={child} />;
  });

  return React.createElement(Component, props, ... (renderedChildren || []));
};
