declare module '*.mujs' {
    import { MuComponent } from '@mulanjs/mulanjs';
    const component: new (...args: any[]) => MuComponent;
    export default component;
}