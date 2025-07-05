import Spline from '@splinetool/react-spline';

export default function Home() {
  return (
    <div style={{ backgroundColor: 'black', top: 0, zIndex: 10, position: 'absolute', width: '100%', height: '100%' }}>
       <Spline scene="https://prod.spline.design/DCWwMJYV5qKtvWg6/scene.splinecode" />
    </div>
  );
}
