import Header from "../components/Header";

type BasicLayoutProps = {
  children: React.ReactNode;
};

const BasicLayout = ({ children }: BasicLayoutProps) => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="flex h-screen w-full flex-col bg-gray-800 shadow-2xl shadow-zinc-900 sm:w-3/5 md:w-3/5 lg:w-2/5 xl:w-1/4">
        <Header />
        <main className="flex w-full flex-col overflow-y-scroll pb-5">
          {children}
        </main>
      </div>
    </div>
  );
};

export default BasicLayout;
