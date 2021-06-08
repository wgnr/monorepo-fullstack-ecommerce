// import styled, { css } from 'styled-components';

// export const SButton = styled.button(({ theme, variant }) => {
//   const variants = {
//     normal: css`
//       font-weight: ${theme.typography.weights.regularUpper};
//       font-size: ${theme.typography.sizes.large};
//     `,

//     highlight: css`
//       text-align: center;
//       background-color: ${theme.colors.primary.roseLight};
//       font-weight: ${theme.typography.weights.bold};
//       font-size: ${theme.typography.sizes.medium};
//       transition: box-shadow 200ms ease;
//       padding: 14px 24px;
//       border-radius: 200px;
//       border: 0;

//       &:active {
//         outline: 0;
//       }
//       &:hover {
//         outline: 0;
//         box-shadow: ${theme.measurements.shadows.highlight};
//       }
//     `,

//     footer: css`
//       font-weight: ${theme.typography.weights.bold};
//       font-size: ${theme.typography.sizes.medium};
//       opacity: 0.5;
//       transition: opacity 200ms ease;

//       &:hover {
//         opacity: 1;
//       }

//       &:active {
//         outline: 0;
//       }
//     `,

//     social: css`
//       font-family: ${theme.typography.font.socialLink};
//       font-weight: ${theme.typography.weights.bold};
//       font-size: ${theme.typography.sizes.small};

//       &:hover,
//       &:active {
//         outline: 0;
//       }
//     `,

//     termsAndCond: css`
//       color: ${theme.colors.primary.termsAndCond};
//       font-size: ${theme.typography.sizes.small};
//       font-weight: ${theme.typography.weights.bold};

//       &:active,
//       &:hover {
//         outline: 0;
//       }
//     `,
//   };

//   return css`
//     display: inline-block;
//     cursor: pointer;
//     text-decoration: none;
//     background-color: transparent;
//     font-family: ${theme.typography.font.primary};
//     color: ${theme.colors.primary.black};
//     border: none;

//     ${variants[variant]};
//   `;
// });
