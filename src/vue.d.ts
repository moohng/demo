declare module '*.vue' {
  import { DefineComponent, ComponentCustomProperties } from 'vue';

  const Component: DefineComponent<{}, {}, any>;

  export default Component;

  interface ComponentCustomProperties extends ComponentCustomProperties {
    // $myMethod: (params: any) => void;
  }
}

declare const __DEMO_LIST__: string;
