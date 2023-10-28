import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Listbox, ListboxItem } from "@nextui-org/react";

import { VscChevronRight, VscAccount } from "react-icons/vsc"
import { TfiAnnouncement } from "react-icons/tfi"
import { GiBroom } from "react-icons/gi"
import { AiOutlineAlert } from "react-icons/ai"
import { PiBowlFood } from "react-icons/pi"
import { AuthContext } from "../utils/AuthProvider";

export default function Sidebar({ current }) {

    const navigate = useNavigate();

    const { user } = useContext(AuthContext);

    return (

        user.role === "user"
            ?
            <Listbox
                aria-label="Dashboard Menu"
                onAction={(key) => navigate("/dashboard/" + key)}
                className="p-0 gap-0 divide-y divide-default-300/50 bg-default-100 max-w-[300px] overflow-visible shadow-small rounded-r-medium"
                itemClasses={{
                    base: "px-3 first:rounded-t-medium last:rounded-b-medium rounded-none shadow bg-content1 gap-3 h-16 data-[hover=true]:bg-default-100",
                }}
            >

                <ListboxItem
                    key="announcements"
                    endContent={<VscChevronRight className="text-default-400 text-xl" />}
                    startContent={
                        <div className="border-[0.5px] border-default bg-success/10 text-success flex items-center rounded-small justify-center w-10 h-10">
                            <TfiAnnouncement className="text-xl " />
                        </div>
                    }
                    className={current === "announcements" && "bg-success-50"}
                >
                    Announcements
                </ListboxItem>
                <ListboxItem
                    key="support"
                    endContent={<VscChevronRight className="text-default-400 text-xl" />}
                    startContent={
                        <div className="border-[0.5px] border-default bg-primary/10 text-primary flex items-center rounded-small justify-center w-10 h-10">
                            <GiBroom className="text-xl " />
                        </div>
                    }
                    className={current === "support" && "bg-primary-50"}
                >
                    Repair & Maintenance Support
                </ListboxItem >
                <ListboxItem
                    key="theft-report"
                    endContent={<VscChevronRight className="text-default-400 text-xl" />}
                    startContent={
                        <div className="border-[0.5px] border-default bg-secondary/10 text-secondary flex items-center rounded-small justify-center w-10 h-10">
                            <AiOutlineAlert className="text-xl " />
                        </div>
                    }
                    className={current === "theft-report" && "bg-secondary-50"}
                >
                    Theft Report
                </ListboxItem>
                <ListboxItem
                    key="order"
                    endContent={<VscChevronRight className="text-default-400 text-xl" />}
                    startContent={
                        <div className="border-[0.5px] border-default bg-warning/10 text-warning flex items-center rounded-small justify-center w-10 h-10">
                            <PiBowlFood className="text-xl " />
                        </div>
                    }
                    className={current === "order" && "bg-warning-50"}
                >
                    Order Food
                </ListboxItem>
                <ListboxItem
                    key="account"
                    endContent={<VscChevronRight className="text-default-400 text-xl" />}
                    startContent={
                        <div className="border-[0.5px] border-default bg-default/50 text-foreground flex items-center rounded-small justify-center w-10 h-10">
                            <VscAccount className="text-xl" />
                        </div>
                    }
                    className={current === "account" && "bg-default-100"}
                >
                    Account
                </ListboxItem>
            </Listbox>
            : user.role === "staff"
                ? <Listbox
                    aria-label="Dashboard Menu"
                    onAction={(key) => navigate("/dashboard/" + key)}
                    className="p-0 gap-0 divide-y divide-default-300/50 bg-default-100 max-w-[300px] overflow-visible shadow-small rounded-r-medium"
                    itemClasses={{
                        base: "px-3 first:rounded-t-medium last:rounded-b-medium rounded-none shadow bg-content1 gap-3 h-16 data-[hover=true]:bg-default-100",
                    }}
                >

                    <ListboxItem
                        key="announcements"
                        endContent={<VscChevronRight className="text-default-400 text-xl" />}
                        startContent={
                            <div className="border-[0.5px] border-default bg-success/10 text-success flex items-center rounded-small justify-center w-10 h-10">
                                <TfiAnnouncement className="text-xl " />
                            </div>
                        }
                        className={current === "announcements" && "bg-success-50"}
                    >
                        Announcements
                    </ListboxItem>
                    <ListboxItem
                        key="support"
                        endContent={<VscChevronRight className="text-default-400 text-xl" />}
                        startContent={
                            <div className="border-[0.5px] border-default bg-primary/10 text-primary flex items-center rounded-small justify-center w-10 h-10">
                                <GiBroom className="text-xl " />
                            </div>
                        }
                        className={current === "support" && "bg-primary-50"}
                    >
                        Repair & Maintenance Support
                    </ListboxItem >
                    <ListboxItem
                        key="theft-report"
                        endContent={<VscChevronRight className="text-default-400 text-xl" />}
                        startContent={
                            <div className="border-[0.5px] border-default bg-secondary/10 text-secondary flex items-center rounded-small justify-center w-10 h-10">
                                <AiOutlineAlert className="text-xl " />
                            </div>
                        }
                        className={current === "theft-report" && "bg-secondary-50"}
                    >
                        Theft Report
                    </ListboxItem>
                </Listbox>
                : <>

                </>
    );
}
