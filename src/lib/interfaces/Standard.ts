//
// based on the .NET framework
//
// Authors:
// * @bhouston
//

export interface ICloneable<T> {
	clone(): T;
}

export interface IComparable<T> {
	comparable(a: T, b: T): number;
}

export interface IEquatable<T> {
	equals(t: T): boolean;
}

export interface IDisposable {
	disposed: boolean;
	dispose(): void;
}

export interface IIdentifiable {
	uuid: string;
}

export interface IVersionable {
	version: number;
	dirty(): void;
}