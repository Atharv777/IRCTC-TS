import React, { useContext } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Avatar, Image } from "@nextui-org/react";
import { AuthContext } from '../utils/AuthProvider';

export default function Message({ data }) {

    const { user } = useContext(AuthContext)

    return (
        <div className={`flex w-full ${data.uid === user.verifierId ? "justify-end" : "justify-start"}`}>
            <Card className={`max-w-[400px] ${data.uid === user.verifierId ? "rounded-br-sm" : "rounded-bl-sm"}`}>
                <CardHeader className="justify-between">
                    <div className="flex gap-4">
                        <Avatar
                            radius="full"
                            size="md"
                            name={data.name}
                            src={data.avatar}
                        />
                        <div className="flex flex-col items-start justify-center">
                            <h4 className="text-medium font-semibold leading-none text-default-600">{data.name}</h4>
                            <h5 className="text-tiny tracking-tight text-default-400">{data.seat}</h5>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="px-4 py-0 text-small text-default-700">
                    {
                        data.imgUrl
                            ? <a href={data.imgUrl} target="_blank" rel="noreferrer"><Image
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                className="w-full object-cover mb-3"
                                src={data.imgUrl}
                            /></a>
                            : null
                    }

                    {
                        data.text.split("/n").map((txt) => {
                            return (<p className='mb-2'>{txt}</p>)
                        })
                    }
                </CardBody>
                <CardFooter className="justify-end">
                    <p className="text-default-400 text-small">{new Date(data.timestamp.seconds * 1000).toLocaleString("default", {
                        hour: "numeric",
                        minute: "numeric",
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    })}</p>
                </CardFooter>
            </Card>
        </div>
    )
}
