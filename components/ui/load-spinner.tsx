import { ThreeDots } from "react-loader-spinner";

function Spinner() {
  return (
    <div className="flex justify-center">
        <ThreeDots
        visible={true}
        height={80}
        width="80"
        color="#53eafd"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
        />
    </div>
  )
}

export default Spinner