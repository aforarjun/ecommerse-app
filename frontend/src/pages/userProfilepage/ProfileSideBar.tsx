import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import {
    MdOutlineAdminPanelSettings,
    MdOutlinePayment,
    MdOutlineTrackChanges,
} from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { RxPerson } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "../../redux/hook";
import { axiosInstance } from "../../server";

const ProfileSidebar = ({ setActive, active }: any) => {
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.user);

    const logoutHandler = () => {
        axiosInstance.get('/user/logout-user', { withCredentials: true })
            .then((res) => {
                toast.success(res.data.message);
                navigate("/");
                window.location.reload();
            })
            .catch((error) => {
                toast.success(error.response.data.message);
                console.log(error.response.data.message);
            });
    };

    const sideButtons: any = [
        {
            active: 1,
            activeHead: active === 1,
            icon: <RxPerson size={20} color={active === 1 ? "red" : ""} />,
            title: 'Profile',
            link: '/profile'
        },
        {
            active: 2,
            activeHead: active === 2,
            icon: <HiOutlineShoppingBag size={20} color={active === 2 ? "red" : ""} />,
            title: 'Orders',
            link: '/profile/allOrders'
        },
        {
            active: 3,
            activeHead: active === 3,
            icon: <HiOutlineReceiptRefund size={20} color={active === 3 ? "red" : ""} />,
            title: 'Refunds',
            link: '/profile/allRefundOrders'
        },
        {
            active: 4,
            activeHead: active === 4,
            icon: <AiOutlineMessage size={20} color={active === 4 ? "red" : ""} />,
            title: 'Inbox',
            link: '/profile/inbox'
        },
        {
            active: 5,
            activeHead: active === 5,
            icon: <MdOutlineTrackChanges size={20} color={active === 5 ? "red" : ""} />,
            title: 'Track Order',
            link: '/profile/trackOrder'
        },
        {
            active: 6,
            activeHead: active === 6,
            icon: <RiLockPasswordLine size={20} color={active === 6 ? "red" : ""} />,
            title: 'Change Password',
            link: '/profile/changePassword'
        },
        {
            active: 7,
            activeHead: active === 7,
            icon: <TbAddressBook size={20} color={active === 7 ? "red" : ""} />,
            title: 'Address',
            link: '/profile/address'
        },
        {
            active: 8,
            activeHead: active === 8,
            icon: <MdOutlinePayment size={20} color={active === 8 ? "red" : ""} />,
            title: 'Payment Methods',
            link: '/profile/paymentMethod'
        },
    ]

    return (
        <div className="w-full bg-white shadow-sm rounded-[10px] p-4 pt-8">
            {sideButtons.map(({ active, icon, title, activeHead, link }: any) => (
                <Link to={link} key={active + title}>
                    <div
                        className="flex items-center cursor-pointer w-full mb-8"
                        onClick={() => setActive(active)}
                    >
                        {icon}
                        <span
                            className={`pl-3 ${activeHead ? "text-[red]" : ""
                                } 800px:block hidden`}
                        >
                            {title}
                        </span>
                    </div>
                </Link>
            ))}


            {user && user?.role === "Admin" && (
                <Link to="/admin/dashboard">
                    <div
                        className="flex items-center cursor-pointer w-full mb-8"
                        onClick={() => setActive(8)}
                    >
                        <MdOutlineAdminPanelSettings
                            size={20}
                            color={active === 7 ? "red" : ""}
                        />
                        <span
                            className={`pl-3 ${active === 8 ? "text-[red]" : ""
                                } 800px:block hidden`}
                        >
                            Admin Dashboard
                        </span>
                    </div>
                </Link>
            )}

            <div
                className="single_item flex items-center cursor-pointer w-full mb-8"
                onClick={logoutHandler}
            >
                <AiOutlineLogin size={20} color={active === 9 ? "red" : ""} />
                <span
                    className={`pl-3 ${active === 9 ? "text-[red]" : ""
                        } 800px:block hidden`}
                >
                    Log out
                </span>
            </div>
        </div>
    );
};

export default ProfileSidebar;