import React from "react";
import clsx from "clsx";
import CardImage from "@components/petCard/cardImage";
import CardText from "./cardText";
import FavoriteButton from "../buttons/FavoriteButton";

export default function PetCard({ className = "", pet, post }) {
    return (
        <div className={clsx("w-64 rounded-xl overflow-hidden bg-white drop-shadow-md flex flex-col relative", className)}>
            <FavoriteButton className="absolute top-2 right-2 z-10" />
            <CardImage image="defaultcardimg.jpg"/>
            <CardText />
        </div>
    );
}
