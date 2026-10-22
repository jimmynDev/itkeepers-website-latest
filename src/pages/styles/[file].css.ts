import { sharedStyles } from '../../data/shared-styles';

export function getStaticPaths() {
  return Object.values(sharedStyles).map(({ file, css }) => ({ params: { file }, props: { css } }));
}

export function GET({ props }: { props: { css: string } }) {
  return new Response(props.css, { headers: { 'Content-Type': 'text/css; charset=utf-8' } });
}
