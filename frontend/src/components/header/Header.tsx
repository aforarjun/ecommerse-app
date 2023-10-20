import { useState } from 'react';
import styles from '../../styles/styles';
import { Link } from 'react-router-dom';
import { AiOutlineHeart, AiOutlineSearch, AiOutlineShoppingCart } from 'react-icons/ai';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import { BiMenuAltLeft } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import DropDown from './DropDown';
import Navbar from './Navbar';
import Cart from './Cart';
import Wishlist from './Wishlist';
import { useAppSelector } from '../../redux/hook';
import { productData, categoriesData } from '../../static/data';
import { RxCross1 } from 'react-icons/rx';
import Button from '../Button';

type searchData = any;

const Header = ({ activeHeading }: any) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.user);
  const { isSeller, seller } = useAppSelector((state) => state.seller);
  const { wishlist } = useAppSelector((state) => state.wishlist);
  const { cart } = useAppSelector((state) => state.cart);

  const [searchData, setSearchData] = useState<searchData>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [active, setActive] = useState<boolean>(false);
  const [dropDown, setDropDown] = useState(false);

  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [openSideHeader, setOpenSideHeader] = useState(false);

  const handleSearchChange = (e: any) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredProducts: any = productData.filter((product) =>
      product.name.toLowerCase().includes(term.toLowerCase())
    );
    setSearchData(filteredProducts);
  };

  window.addEventListener('scroll', () => {
    if (window.scrollY > 70) {
      setActive(true);
    } else {
      setActive(false);
    }
  });

  return (
    <>
      <div className="bg-white">
        <div className={`${styles.section}`}>
          <div className="hidden 800px:h-[50px] 800px:mb-[20px] 800px:pt-[20px] 800px:flex items-center justify-between">
            <div>
              <Link to="/">
                <h2 className="text-2xl font-[700]">eShop</h2>
              </Link>
            </div>

            <div className="w-[50%] relative">
              <input
                type="text"
                placeholder="Search Product..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e)}
                onBlur={() => setSearchData([])}
                className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
              />
              <AiOutlineSearch size={30} className="absolute right-2 top-1.5 cursor-pointer" />
              {searchData.length > 0 ? (
                <div className="absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-[9] p-4">
                  {searchData.map((i: any) => {
                    const d = i.name;
                    const Product_name = d.replace(/\s+/g, '-');
                    return (
                      <Link to={`/product/${Product_name}`}>
                        <div className="w-full flex items-start-py-3">
                          <img
                            src={`${i.image_Url[0]?.url}`}
                            alt=""
                            className="w-[40px] h-[40px] mr-[10px]"
                          />
                          <h1>{i.name}</h1>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <div className={`${styles.button}`}>
              <Link to={`${isSeller ? `/seller/${seller?._id}` : '/seller/login'}`}>
                <Button
                  title={`${isSeller ? 'Seller Profile' : 'Become Seller'}`}
                  icon={<IoIosArrowForward className="ml-1" />}
                  wrapperStyle={{ backgroundColor: '#000' }}
                />
              </Link>
            </div>
          </div>
        </div>

        <div
          className={`${
            active ? 'shadow-sm fixed top-0 left-0 z-10' : null
          } transition hidden 800px:flex items-center justify-between w-full bg-[#3321c8] h-[70px]`}>
          <div className={`${styles.section} relative ${styles.noramlFlex} justify-between`}>
            {/* categories */}
            <div onClick={() => setDropDown(!dropDown)}>
              <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block">
                <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
                <button
                  className={`h-[100%] w-full flex justify-between items-center pl-10 bg-white font-sans text-lg font-[500] select-none rounded-t-md`}>
                  All Categories
                </button>
                <IoIosArrowDown
                  size={20}
                  className="absolute right-2 top-4 cursor-pointer"
                  onClick={() => setDropDown(!dropDown)}
                />
                {dropDown ? (
                  <DropDown categoriesData={categoriesData} setDropDown={setDropDown} />
                ) : null}
              </div>
            </div>

            {/* navitems */}
            <div className={`${styles.noramlFlex}`}>
              <Navbar active={activeHeading} />
            </div>

            {/* Right side - cart / wishlist / user */}
            <div className="flex">
              <div className={`${styles.noramlFlex}`}>
                <button
                  className="relative cursor-pointer mr-[15px]"
                  onClick={() => setOpenWishlist(true)}>
                  <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
                  <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                    {wishlist.length}
                  </span>
                </button>
              </div>

              <div className={`${styles.noramlFlex}`}>
                <div
                  className="relative cursor-pointer mr-[15px]"
                  onClick={() => setOpenCart(true)}>
                  <AiOutlineShoppingCart size={30} color="rgb(255 255 255 / 83%)" />
                  <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                    {cart?.reduce((accumulator, currentValue) => accumulator + currentValue.qty, 0)}
                  </span>
                </div>
              </div>

              <div className={`${styles.noramlFlex}`}>
                <div className="relative cursor-pointer mr-[15px]">
                  {isAuthenticated ? (
                    <Link to="/profile">
                      <img
                        src={`${user?.avatar}`}
                        className="w-[35px] h-[35px] rounded-full object-cover"
                        alt=""
                      />
                    </Link>
                  ) : (
                    <Link to="/auth/login">
                      <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                    </Link>
                  )}
                </div>
              </div>

              {/* cart popup */}
              {openCart && <Cart setOpenCart={setOpenCart} onBlur={() => setOpenCart(false)} />}

              {/* wishlist popup */}
              {openWishlist && (
                <Wishlist setOpenWishlist={setOpenWishlist} onBlur={() => setOpenCart(false)} />
              )}
            </div>
          </div>
        </div>

        {/* Mobole header */}
        <div
          className={`${
            active ? 'shadow-sm fixed top-0 left-0 z-10' : null
          } w-full h-[70px] items-center bg-white z-50 top-0 left-0 grid 800px:hidden`}>
          <div className="w-full flex items-center justify-between m-auto">
            <div>
              <BiMenuAltLeft
                size={40}
                className="ml-4 cursor-pointer"
                onClick={() => setOpenSideHeader(true)}
              />
            </div>

            <div>
              <Link to={'/'}>
                <h4 className="text-2xl font-[700]">eShop</h4>
              </Link>
            </div>

            <div className={`${styles.noramlFlex}`}>
              <div className="relative cursor-pointer mr-[15px]" onClick={() => setOpenCart(true)}>
                <AiOutlineShoppingCart size={30} color="#000" />
                <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {cart && cart.length}
                </span>
              </div>
            </div>
          </div>

          {/* cart popup */}
          {openCart && <Cart setOpenCart={setOpenCart} onBlur={() => setOpenCart(false)} />}

          {/* Open header sideBar */}
          {openSideHeader && (
            <div className="fixed w-full bg-[#0000005f] z-50 h-screen top-0 left-0">
              <div className="fixed w-[80%] bg-[#fff] h-screen top-0 left-0 z-10">
                <div className="w-full justify-between flex pr-3 mt-5">
                  <div className="flex items-center gap-2 ml-3">
                    <div>
                      {isAuthenticated ? (
                        <Link to="/profile">
                          <img
                            src={`${user?.avatar}`}
                            className="w-[35px] h-[35px] rounded-full"
                            alt=""
                          />
                        </Link>
                      ) : (
                        <Link to="/auth/login">
                          <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                        </Link>
                      )}
                    </div>

                    <div className="relative cursor-pointer mr-[15px]">
                      <AiOutlineHeart size={30} className="ml-3" />
                      <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                        {wishlist && wishlist.length}
                      </span>
                    </div>
                  </div>

                  <RxCross1
                    size={30}
                    className="ml-4 cursor-pointer"
                    onClick={() => setOpenSideHeader(false)}
                  />
                </div>

                <div className="mt-6 m-auto w-[92%] relative">
                  <input
                    type="text"
                    placeholder="Search Product..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e)}
                    className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
                  />
                  {searchTerm && (
                    <RxCross1
                      size={20}
                      className="absolute right-2 top-3 cursor-pointer"
                      onClick={() => {
                        setSearchTerm('');
                        setSearchData([]);
                      }}
                    />
                  )}
                  {searchData.length > 0 ? (
                    <div className="absolute h-[60vh] bg-slate-50 shadow-sm-2 z-[9] mt-1 overflow-scroll">
                      {searchData.map((i: any) => {
                        const d = i.name;
                        const Product_url = d.replace(/\s+/g, '-');
                        return (
                          <Link to={`/product/${Product_url}`}>
                            <div className="w-full flex items-center py-1">
                              <img
                                src={`${i.image_Url[0]?.url}`}
                                alt=""
                                className="w-[30px] h-[30px] mr-[10px]"
                              />
                              <h4 className="text-sm">{i.name}</h4>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>

                <div className="mt-6">
                  <Navbar active={activeHeading} />
                </div>

                {isSeller ? (
                  <Link to={`/seller/${seller?._id}`}>
                    <Button
                      title="Seller Profile"
                      icon={<IoIosArrowForward className="ml-1" />}
                      wrapperStyle={{ width: 200, marginLeft: 10, backgroundColor: '#000' }}
                    />
                  </Link>
                ) : (
                  <Link to={`/seller/login`}>
                    <Button
                      title="Become Seller"
                      icon={<IoIosArrowForward className="ml-1" />}
                      wrapperStyle={{ width: 200, marginLeft: 10, backgroundColor: '#000' }}
                    />
                  </Link>
                )}

                <br />
                <br />
                <br />
                {!isAuthenticated && (
                  <>
                    <Link to="/auth/login">Login / </Link>
                    <Link to="/auth/sign-up">Signup</Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
