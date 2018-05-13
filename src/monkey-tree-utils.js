import * as R from 'ramda';

export const isNotEmpty = R.complement(R.isEmpty);
export const isNotNil = R.complement(R.isNil);
export const isNotNilOrEmpty = R.both(isNotEmpty, isNotNil);
