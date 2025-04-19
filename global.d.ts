// global.d.ts

// NativeWind type support
/// <reference types="nativewind/types" />

// Optional: Additional global types
declare module '*.svg' {
    import React from 'react';
    import { SvgProps } from 'react-native-svg';
    const content: React.FC<SvgProps>;
    export default content;
}