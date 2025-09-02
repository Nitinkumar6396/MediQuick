import { assets } from "../assets/assets"

const Footer = () => {
    return (
        <div>
            <div className="grid sm:grid-cols-[3fr_1fr_1fr] gap-10 mt-32 rounded-lg">
                <div className="">
                    <img className="w-40 mb-5" src={assets.logo} />
                    <p className="text-sm leading-6 sm:w-2/3 text-gray-600">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry,s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-xl font-medium mb-5">COMPANY</h1>
                    <ul className="text-gray-600">
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>

                <div className="flex flex-col w-fit">
                    <h1 className="text-xl font-medium mb-5">GET IN TOUCH</h1>
                    <ul className="text-gray-600">
                        <li>+0-000-000-000</li>
                        <li>mediquick@gmail.com</li>
                    </ul>
                </div>

            </div>
            <div className="mt-12">
                <hr />
                <p className="text-[1rem] text-center my-5">Copyright 2024 @ Greatstack.dev - All Right Reserved.</p>
            </div>
        </div>
    )
}

export default Footer