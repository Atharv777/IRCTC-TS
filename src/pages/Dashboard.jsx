import React, { useContext, useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom';

import Sidebar from "../components/Sidebar"
import Message from "../components/Message"
import { AuthContext } from '../utils/AuthProvider';
import { Input, Button, Image, Card, CardHeader, CardBody, CardFooter, Avatar, Link, Divider } from '@nextui-org/react';
import { VscSend } from 'react-icons/vsc';
import { BiImageAdd } from 'react-icons/bi';

import { query, collection, orderBy, onSnapshot, limit, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import { storeMessage, uploadImage, db } from '../utils/firebase';

export default function Dashboard() {

    const { connected, user } = useContext(AuthContext)
    const { tab } = useParams();
    const navigate = useNavigate();

    const tabs = ["announcements", "support", "theft-report", "order", "account"]

    useEffect(() => {
        if (!tabs.includes(tab) && (user?.role === "user" || user?.role === "staff")) {
            navigate("/dashboard/announcements")
        }
    }, [tab, user])


    return (
        <div className={`flex justify-center w-full h-full flex-1 ${user?.role !== "vendor" && "max-h-[calc(100vh-70px)]"}`}>
            {
                connected
                    ? <>
                        <Sidebar current={tab} />
                        {(user.role === "user" || user.role === "staff") && tab === "announcements" && <Announcements />}
                        {(user.role === "user" || user.role === "staff") && tab === "support" && <Support />}
                        {(user.role === "user" || user.role === "staff") && tab === "theft-report" && <TheftSupport />}
                        {user.role === "user" && tab === "order" && <Order />}
                        {user.role === "user" && tab === "account" && <Account />}
                        {user.role === "vendor" && <VendorAccount />}
                    </>
                    : <p className='text-xl font-semibold leading-none text-default-600 m-auto'>No Account connected</p>
            }

        </div>
    )
}

const Announcements = () => {
    const { user } = useContext(AuthContext)

    const [sendLoading, setSendLoading] = useState(false);
    const [textInpValue, setTextInpValue] = useState("");
    const [imageUploadURL, setImageUploadURL] = useState("");
    const [messages, setMessages] = useState([]);
    const hiddenFileInput = useRef(null);

    useEffect(() => {
        const q = query(
            collection(db, "announcements"),
            orderBy("timestamp", "desc"),
            limit(50)
        );
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            const fetchedMessages = [];
            QuerySnapshot.forEach((doc) => {
                fetchedMessages.push({ ...doc.data(), id: doc.id });
            });
            const sortedMessages = fetchedMessages.sort(
                (a, b) => a.timestamp - b.timestamp
            );
            setMessages(sortedMessages);
        });
        return () => unsubscribe;
    }, []);

    const handleFileClick = e => {
        hiddenFileInput.current.click();
    };

    const handleSubmit = async () => {
        setSendLoading(true)
        if (imageUploadURL) {
            const fileURL = await uploadImage(imageUploadURL, new Date().getTime())
            await storeMessage(textInpValue, fileURL, user, "Station Manager", "announcements")
        }
        else {
            await storeMessage(textInpValue, null, user, "Station Manager", "announcements")
        }
        setImageUploadURL(null)
        setTextInpValue("")
        setSendLoading(false)
    };

    return (
        <div className='flex-1 flex flex-col p-0'>
            <div className='flex flex-col gap-7 p-8 pb-5 mb-5 overflow-auto noscrollbar'>
                {messages?.map(msg => {
                    return (
                        <Message data={msg} />
                    )
                })}
            </div>
            {
                user.role === "staff"
                && <>
                    {
                        imageUploadURL && <div className='px-8 mb-2'><Image
                            radius="sm"
                            className="w-20 h-20 object-cover"
                            src={URL.createObjectURL(imageUploadURL)}
                        /></div>
                    }


                    <div className='flex flex-row justify-center items-center gap-3 mt-auto mb-5 px-8'>
                        <Input
                            type="text"
                            variant='faded'
                            size='lg'
                            placeholder="Enter your message here..."
                            value={textInpValue}
                            onValueChange={setTextInpValue}
                        />
                        <div className="border-[0.5px] border-default bg-secondary/10 hover:bg-secondary/20 text-secondary flex items-center rounded-small justify-center w-12 h-12 transition cursor-pointer">
                            <Input
                                placeholder="Choose image"
                                accept="image/png,image/jpeg"
                                type="file"
                                ref={hiddenFileInput}
                                onChange={(e) => {
                                    setImageUploadURL(e.target.files[0]);
                                }}
                                className='hidden'
                            />
                            <BiImageAdd className="text-2xl" onClick={handleFileClick} />
                        </div>
                        <div className="border-[0.5px] border-default bg-success/10 hover:bg-success/20 text-success flex items-center rounded-small justify-center w-12 h-12 transition cursor-pointer">
                            {
                                sendLoading
                                    ? <svg aria-hidden="true" class="w-6 h-6 text-transparent animate-spin fill-success" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                    </svg>
                                    : <VscSend className="text-2xl" onClick={handleSubmit} />
                            }
                        </div>
                    </div>
                </>
            }
        </div>
    )
}
const Support = () => {

    const { user } = useContext(AuthContext)

    const [sendLoading, setSendLoading] = useState(false);
    const [textInpValue, setTextInpValue] = useState("");
    const [imageUploadURL, setImageUploadURL] = useState("");
    const [messages, setMessages] = useState([]);
    const hiddenFileInput = useRef(null);

    useEffect(() => {
        const q = query(
            collection(db, "support"),
            orderBy("timestamp", "desc"),
            limit(50)
        );
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            const fetchedMessages = [];
            QuerySnapshot.forEach((doc) => {
                fetchedMessages.push({ ...doc.data(), id: doc.id });
            });
            const sortedMessages = fetchedMessages.sort(
                (a, b) => a.timestamp - b.timestamp
            );
            setMessages(sortedMessages);
        });
        return () => unsubscribe;
    }, []);

    const handleFileClick = e => {
        hiddenFileInput.current.click();
    };

    const handleSubmit = async () => {
        setSendLoading(true)
        if (imageUploadURL) {
            const fileURL = await uploadImage(imageUploadURL, new Date().getTime())
            await storeMessage(textInpValue, fileURL, user, "12060 (C2, 18)", "support")
        }
        else {
            await storeMessage(textInpValue, null, user, "12060 (C2, 18)", "support")
        }
        setImageUploadURL(null)
        setTextInpValue("")
        setSendLoading(false)
    };

    return (
        <div className='flex-1 flex flex-col p-0'>
            <div className='flex flex-col gap-7 p-8 pb-5 mb-5 overflow-auto noscrollbar'>
                {messages?.map(msg => {
                    return (
                        <Message data={msg} />
                    )
                })}
            </div>

            {
                imageUploadURL && <div className='px-8 mb-2'><Image
                    radius="sm"
                    className="w-20 h-20 object-cover"
                    src={URL.createObjectURL(imageUploadURL)}
                /></div>
            }
            <div className='flex flex-row justify-center items-center gap-3 mt-auto mb-5 px-8'>
                <Input
                    type="text"
                    variant='faded'
                    size='lg'
                    placeholder="Enter your message here..."
                    value={textInpValue}
                    onValueChange={setTextInpValue}
                />
                <div className="border-[0.5px] border-default bg-secondary/10 hover:bg-secondary/20 text-secondary flex items-center rounded-small justify-center w-12 h-12 transition cursor-pointer">
                    <Input
                        placeholder="Choose image"
                        accept="image/png,image/jpeg"
                        type="file"
                        ref={hiddenFileInput}
                        onChange={(e) => {
                            setImageUploadURL(e.target.files[0]);
                        }}
                        className='hidden'
                    />
                    <BiImageAdd className="text-2xl" onClick={handleFileClick} />
                </div>
                <div className="border-[0.5px] border-default bg-success/10 hover:bg-success/20 text-success flex items-center rounded-small justify-center w-12 h-12 transition cursor-pointer">
                    {
                        sendLoading
                            ? <svg aria-hidden="true" class="w-6 h-6 text-transparent animate-spin fill-success" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            : <VscSend className="text-2xl" onClick={handleSubmit} />
                    }
                </div>
            </div>
        </div>
    )
}
const TheftSupport = () => {

    const { user } = useContext(AuthContext)

    const [sendLoading, setSendLoading] = useState(false);
    const [textInpValue, setTextInpValue] = useState("");
    const [imageUploadURL, setImageUploadURL] = useState("");
    const [messages, setMessages] = useState([]);
    const hiddenFileInput = useRef(null);

    useEffect(() => {
        const q = query(
            collection(db, "theft-support"),
            orderBy("timestamp", "desc"),
            limit(50)
        );
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            const fetchedMessages = [];
            QuerySnapshot.forEach((doc) => {
                fetchedMessages.push({ ...doc.data(), id: doc.id });
            });
            const sortedMessages = fetchedMessages.sort(
                (a, b) => a.timestamp - b.timestamp
            );
            setMessages(sortedMessages);
        });
        return () => unsubscribe;
    }, []);

    const handleFileClick = e => {
        hiddenFileInput.current.click();
    };

    const handleSubmit = async () => {
        setSendLoading(true)
        if (imageUploadURL) {
            const fileURL = await uploadImage(imageUploadURL, new Date().getTime())
            await storeMessage(textInpValue, fileURL, user, "12060 (C2, 18)", "theft-support")
        }
        else {
            await storeMessage(textInpValue, null, user, "12060 (C2, 18)", "theft-support")
        }
        setImageUploadURL(null)
        setTextInpValue("")
        setSendLoading(false)
    };

    return (
        <div className='flex-1 flex flex-col p-0'>
            <div className='flex flex-col gap-7 p-8 pb-5 mb-5 overflow-auto noscrollbar'>
                {messages?.map(msg => {
                    return (
                        <Message data={msg} />
                    )
                })}
            </div>

            {
                imageUploadURL && <div className='px-8 mb-2'><Image
                    radius="sm"
                    className="w-20 h-20 object-cover"
                    src={URL.createObjectURL(imageUploadURL)}
                /></div>
            }
            <div className='flex flex-row justify-center items-center gap-3 mt-auto mb-5 px-8'>
                <Input
                    type="text"
                    variant='faded'
                    size='lg'
                    placeholder="Report Theft or Security issues here..."
                    value={textInpValue}
                    onValueChange={setTextInpValue}
                />
                <div className="border-[0.5px] border-default bg-secondary/10 hover:bg-secondary/20 text-secondary flex items-center rounded-small justify-center w-12 h-12 transition cursor-pointer">
                    <Input
                        placeholder="Choose image"
                        accept="image/png,image/jpeg"
                        type="file"
                        ref={hiddenFileInput}
                        onChange={(e) => {
                            setImageUploadURL(e.target.files[0]);
                        }}
                        className='hidden'
                    />
                    <BiImageAdd className="text-2xl" onClick={handleFileClick} />
                </div>
                <div className="border-[0.5px] border-default bg-success/10 hover:bg-success/20 text-success flex items-center rounded-small justify-center w-12 h-12 transition cursor-pointer">
                    {
                        sendLoading
                            ? <svg aria-hidden="true" class="w-6 h-6 text-transparent animate-spin fill-success" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            : <VscSend className="text-2xl" onClick={handleSubmit} />
                    }
                </div>
            </div>
        </div>
    )
}
const Order = () => {

    const { user } = useContext(AuthContext)

    const [orderLoading, setOrderLoading] = useState(false)
    const [vendors, setVendors] = useState([])
    const [pastOrders, setPastOrders] = useState([])


    useEffect(() => {
        (async () => {
            const q = query(
                collection(db, "vendors"),
                limit(50)
            );
            const snap = await getDocs(q)
            const fetchedMessages = [];
            snap.forEach((doc) => {
                fetchedMessages.push({ ...doc.data(), id: doc.id });
            });
            setVendors(fetchedMessages);
        })()
    }, [orderLoading]);

    useEffect(() => {
        const q = query(
            doc(db, "users", user.verifierId),
        );
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            setPastOrders(QuerySnapshot.data().pastOrders)
        });
        return () => unsubscribe;
    }, []);

    const handleOrder = async (vendInd, ind) => {
        setOrderLoading({ vendInd, ind })

        const ref = doc(db, "vendors", vendors[vendInd].id)

        if (!vendors[vendInd].currentOrders.some(e => e.name === vendors[vendInd].catalog[ind].name)) {
            await updateDoc(ref, {
                currentOrders: [
                    ...vendors[vendInd].currentOrders,
                    {
                        ...vendors[vendInd].catalog[ind],
                        user
                    }

                ]
            });

        }
        setOrderLoading(false)
    }


    return (
        <div className='flex-1 flex flex-col gap-20 p-10 overflow-auto'>

            <div className='w-full flex flex-row flex-wrap'>
                {
                    vendors.map((item, vendInd) => {
                        return (
                            item?.catalog?.map((food, ind) => {
                                return (
                                    <Card className="py-4">
                                        <CardHeader className="py-0 px-4 flex-col items-start">
                                            <h4 className="font-normal text-default-600 text-md">{item.name}</h4>
                                            <h4 className="font-bold text-xl">{food.name}</h4>
                                            <p className="text-medium uppercase font-bold">₹ {food.price}</p>
                                        </CardHeader>
                                        <CardBody className="overflow-visible py-2 px-4">
                                            <Image
                                                alt={food.name}
                                                className="object-cover rounded-xl"
                                                src={food.img}
                                                width={300}
                                            />
                                        </CardBody>
                                        <CardFooter className="pb-0 px-4">
                                            <Button className="w-full" variant="flat" color="primary" radius="sm" size="md" onClick={() => { if (!item.currentOrders.some(e => e.name === food.name)) { handleOrder(vendInd, ind) } }}>
                                                {
                                                    orderLoading && orderLoading.vendInd === vendInd && orderLoading.ind === ind
                                                        ? <svg aria-hidden="true" class="w-6 h-6 text-transparent animate-spin fill-success" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                        </svg>
                                                        :
                                                        item.currentOrders.some(e => e.name === food.name)
                                                            ? "Ordered Successfully"
                                                            : "Order"
                                                }
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                )
                            })
                        )
                    })
                }
            </div>
            <div className='w-full flex flex-col gap-5'>
                <h2 className="font-extrabold text-3xl">Past Orders</h2>
                <div className='w-full flex flex-row flex-wrap'>
                    {
                        pastOrders.map((food) => {
                            return (
                                <Card className="py-4">
                                    <CardHeader className="py-0 px-4 flex-col items-start">
                                        <h4 className="font-bold text-xl">{food.name}</h4>
                                        <p className="text-medium uppercase font-bold">₹ {food.price}</p>
                                    </CardHeader>
                                    <CardBody className="overflow-visible py-2 px-4">
                                        <Image
                                            alt={food.name}
                                            className="object-cover rounded-xl"
                                            src={food.img}
                                            width={300}
                                        />
                                    </CardBody>
                                    <CardFooter className="pb-0 px-4">
                                        <Button className="w-full" variant="flat" isDisabled color="success" radius="sm" size="md">
                                            Order Delivered
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}
const Account = () => {

    const { user, logoutHandler } = useContext(AuthContext)
    return (
        <div className='flex-1 flex flex-col justify-center items-center p-0'>
            <Card className="w-[400px]">
                <CardHeader className="flex flex-col items-center gap-3 w-full py-5">
                    <Avatar
                        className="transition-transform w-20 h-20"
                        radius="md"

                        name={user.name}
                        src={user.profileImage}
                    />
                    <div className="flex flex-col items-center">
                        <p className="text-xl font-bold">{user.name}</p>
                        <p className="text-small text-default-500">{user.email}</p>
                        <p className="text-tiny text-default-400">({user.address.slice(0, 6) + '...' + user.address.slice(-4)})</p>
                    </div>
                </CardHeader>
                <CardFooter>
                    <Button
                        color="danger"
                        variant="flat"
                        radius="sm"
                        spinnerPlacement="end"
                        className="w-full"
                        onClick={logoutHandler}
                    >
                        Logout
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}



const VendorAccount = () => {

    const { user, logoutHandler } = useContext(AuthContext)

    const [vendors, setVendors] = useState([])

    useEffect(() => {
        const q = query(
            collection(db, "vendors"),
            limit(50)
        );
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            const fetchedMessages = [];
            QuerySnapshot.forEach((doc) => {
                fetchedMessages.push({ ...doc.data(), id: doc.id });
            });
            setVendors(fetchedMessages);
        });
        return () => unsubscribe;
    }, []);

    const handleDone = async (vendInd, ind) => {

        if (vendors[vendInd].currentOrders.some(e => e.name === vendors[vendInd].currentOrders[ind].name)) {

            const ref = doc(db, "vendors", vendors[vendInd].id)
            const ref2 = doc(db, "users", vendors[vendInd].currentOrders.filter(el => el.name === vendors[vendInd].currentOrders[ind].name)[0].user.verifierId)

            const dta2 = await getDoc(ref2)

            await updateDoc(ref, {
                currentOrders: [
                    ...vendors[vendInd].currentOrders.filter(el => el.name !== vendors[vendInd].currentOrders[ind].name)
                ]
            });
            await updateDoc(ref2, {
                pastOrders: [
                    ...dta2.data().pastOrders.filter(el => el.name !== vendors[vendInd].currentOrders[ind].name)
                ]
            });
            await updateDoc(ref2, {
                pastOrders: [
                    ...dta2.data().pastOrders,
                    {
                        ...vendors[vendInd].currentOrders[ind]
                    }
                ]
            });
        }
    }


    return (
        <div className='flex-1 flex flex-col items-center p-10 gap-10'>

            <Card className="w-[400px]">
                <CardHeader className="flex flex-col items-center gap-3 w-full py-5">
                    <Avatar
                        className="transition-transform w-20 h-20"
                        radius="md"

                        name={user.name}
                        src={user.profileImage}
                    />
                    <div className="flex flex-col items-center">
                        <p onClick={() => handleDone(0, 0)} className="text-xl font-bold">{user.name}</p>
                        <p className="text-small text-default-500">{user.email}</p>
                        <p className="text-tiny text-default-400">({user.address.slice(0, 6) + '...' + user.address.slice(-4)})</p>
                    </div>
                </CardHeader>
                <CardFooter>
                    <Button
                        color="danger"
                        variant="flat"
                        radius="sm"
                        spinnerPlacement="end"
                        className="w-full"
                        onClick={logoutHandler}
                    >
                        Logout
                    </Button>
                </CardFooter>
            </Card>

            <div className=' w-full flex flex-row flex-wrap'>
                {
                    vendors.map((item, vendInd) => {
                        if (item?.currentOrders?.length > 0) {
                            return (
                                item?.currentOrders?.map((food, ind) => {
                                    return (
                                        <Card className="py-4">
                                            <CardHeader className="py-0 px-4 flex-col items-start">
                                                <h4 className="font-normal text-default-600 text-md">{item.name}</h4>
                                                <h4 className="font-bold text-xl">{food.name}</h4>
                                                <p className="text-medium uppercase font-bold">₹ {food.price}</p>
                                            </CardHeader>
                                            <CardBody className="overflow-visible py-2 px-4">
                                                <Image
                                                    alt={food.name}
                                                    className="object-cover rounded-xl"
                                                    src={food.img}
                                                    width={300}
                                                />
                                            </CardBody>
                                            <CardFooter className="pb-0 px-4">
                                                <Button className="w-full" variant="flat" color="primary" radius="sm" size="md" onClick={() => { if (item.currentOrders.some(e => e.name === food.name)) { handleDone(vendInd, ind) } }}>
                                                    Complete Order
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    )
                                })
                            )
                        }
                        else {
                            return (
                                <p className='text-xl font-semibold leading-none text-default-600 m-auto'>No current orders</p>
                            )
                        }
                    })
                }
            </div>
        </div>
    )
}