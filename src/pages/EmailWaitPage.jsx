 import ConfirmLoad from  "../component/loader/ConfirmLoad.jsx";

export default function EmailWaitPage() {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <ConfirmLoad/>
                <h1 className="text-2xl font-bold">Veuillez vérifier votre email pour le lien de vérification.</h1>
                <p className="text-sm text-gray-500">Si vous ne voyez pas l&apos;email, veuillez vérifier votre dossier
                    spam.</p>
            </div>
        );
}