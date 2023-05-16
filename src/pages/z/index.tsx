import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import DropMenu from "~/components/dropMenu";
import Header from "~/components/header";

const ActivitiesPage: NextPage = () => {
  const [activities] = useState([
    { id: 1, name: "Activité 1" },
    { id: 2, name: "Activité 2" },
    { id: 3, name: "Activité 3" },
    { id: 4, name: "Activité 3" },
    { id: 5, name: "Activité 3" },
    { id: 6, name: "Activité 3" },
    { id: 7, name: "Activité 3" },
    { id: 8, name: "Activité 3" },
    { id: 9, name: "Activité 3" },
    { id: 10, name: "Activité 3" },
    // Ajoutez d'autres activités fictives ici
  ]);

  return (
    <div className="flex flex-col h-screen bg-[#40534D]">
      {/* Header */}
      {/* Afficher l'en-tête commun à toutes les pages sauf la page de groupe */}
      <Header />

      <main className="mt-8">
        <div className="grid grid-cols-2 gap-4">
          {activities.map((activity, index) => (
            <Link key={activity.id} href={`/activity/${activity.id}`}>
              <div className="flex items-center justify-center bg-white m-4 p-4 rounded-lg shadow-lg square hover:scale-105">
                <h1 className="text-xs">{activity.name}</h1>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ActivitiesPage;
