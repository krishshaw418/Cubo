import { MutatingDots } from "react-loader-spinner";

function Loader() {
  return (
    <div className="flex justify-center">
        <MutatingDots
          visible={true}
          height="100"
          width="100"
          color="#00FFFF"
          secondaryColor="#00FFFF"
          gradientType="linear"
          gradientAngle={50}
          radius="12.5"
          ariaLabel="mutating-dots-loading"
          wrapperStyle={{
            filter: "drop-shadow(0 0 4px #14F195) hue-rotate(10deg)",
          }}
          wrapperClass=""
        />
    </div>
  )
}

export default Loader