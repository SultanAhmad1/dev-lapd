export default function loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}
