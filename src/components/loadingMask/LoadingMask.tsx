import React, { FC } from 'react';

import styles from './LoadingMask.module.scss';

const SIZE = 44;
const THICKNESS = 4;

interface Props {
  isLoading: boolean;
}

const LoadingMask: FC<Props> = ({ isLoading }) => {
  return (
    <>
      {isLoading && (
        <div className={styles.loadingMask}>
          <svg className={styles.spinnerBox} viewBox={`${SIZE / 2} ${SIZE / 2} ${SIZE} ${SIZE}`}>
            <defs>
              <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#6fa2ee" />
                <stop offset="100%" stopColor="#7fb2fe" stopOpacity="0" />
              </linearGradient>
            </defs>
            <circle
              className={styles.spinner}
              cx={SIZE}
              cy={SIZE}
              r={(SIZE - THICKNESS) / 2}
              fill="none"
              strokeWidth={THICKNESS}
              stroke="url(#gradient)"
            />
          </svg>
        </div>
      )}
    </>
  );
};

export default LoadingMask;
