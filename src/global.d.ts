declare module '*.module.scss';
declare module '*.module.css';
declare module '*.scss';
declare module '*.css';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';
declare module '*.mp4';
declare module '*.webp';
declare module '*.avif';

// Allow importing .jsx files
declare module '*.jsx' {
  import { ComponentType } from 'react';
  const Component: ComponentType<any>;
  export default Component;
}

// Allow importing .jsx files through ~ alias
declare module '~/*.jsx' {
  import { ComponentType } from 'react';
  const Component: ComponentType<any>;
  export default Component;
}

// Allow importing any files through ~ alias (fallback)
declare module '~/*' {
  const value: any;
  export default value;
}
