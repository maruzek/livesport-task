import BottomNav from "../components/BottomNav";
import Header from "../components/Header";

type BasicLayoutProps = {
  children: React.ReactNode;
  displayBottomNav?: boolean;
  headerTitle?: string;
};

const BasicLayout = ({
  children,
  displayBottomNav,
  headerTitle,
}: BasicLayoutProps) => {
  return (
    <div className="flex h-[100dvh] w-screen flex-col items-center justify-center">
      <div className="relative flex h-full w-full flex-col bg-gray-800 shadow-2xl shadow-zinc-900 sm:w-3/5 md:w-3/5 lg:w-2/5 xl:w-1/4">
        <Header title={headerTitle} />
        <main className="flex grow flex-col overflow-y-auto">{children}</main>
        {displayBottomNav && <BottomNav />}
      </div>
    </div>
  );
};

export default BasicLayout;
