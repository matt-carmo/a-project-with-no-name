export {};

declare global {
  interface Window {
    hello: {
      greet: () => string;
    };
  }
}
