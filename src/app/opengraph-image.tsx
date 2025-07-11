/* eslint-disable react-refresh/only-export-components */
import { ImageResponse } from 'next/og'

export const revalidate = false

export const alt = 'The client first ai apps'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          version='1.1'
          xmlnsXlink='http://www.w3.org/1999/xlink'
          width='64'
          height='64'
        >
          <svg
            width='64'
            height='64'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M2.5 16.88C2.38123 16.8107 2.27803 16.7176 2.19687 16.6066C2.1157 16.4955 2.05831 16.369 2.02828 16.2348C1.99825 16.1005 1.99622 15.9616 2.02232 15.8266C2.04843 15.6915 2.10211 15.5633 2.18 15.45L11.18 2.43C11.2722 2.29797 11.3948 2.19015 11.5376 2.11569C11.6804 2.04124 11.839 2.00236 12 2.00236C12.161 2.00236 12.3196 2.04124 12.4624 2.11569C12.6052 2.19015 12.7278 2.29797 12.82 2.43L21.82 15.44C21.8996 15.5537 21.9546 15.6826 21.9816 15.8187C22.0087 15.9548 22.0071 16.095 21.977 16.2304C21.9469 16.3659 21.8889 16.4936 21.8068 16.6054C21.7247 16.7172 21.6202 16.8107 21.5 16.88L12.99 21.74C12.6883 21.9118 12.3472 22.0022 12 22.0022C11.6528 22.0022 11.3116 21.9118 11.01 21.74L2.5 16.88Z'
              stroke='black'
              stroke-width='2'
              stroke-linecap='round'
              stroke-linejoin='round'
            ></path>
            <path
              d='M12 2V22'
              stroke='black'
              stroke-width='2'
              stroke-linecap='round'
              stroke-linejoin='round'
            ></path>
            <path
              d='M2.50738 15.9871H11.1437'
              stroke='black'
              stroke-width='2'
              stroke-linecap='round'
            ></path>
          </svg>
        </svg>
        <div style={{ marginTop: 40 }}>ai.aiwan.run</div>
      </div>
    ),
    {
      ...size,
    },
  )
}
