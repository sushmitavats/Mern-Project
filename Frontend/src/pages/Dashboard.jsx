import { useEffect, useRef,useState } from "react";
import Chart from "chart.js/auto";
import { IoPersonOutline, IoPersonAddOutline } from "react-icons/io5";
import { MdOutlinePersonOff } from "react-icons/md";
import { HiOutlineUsers } from "react-icons/hi";
import { getDashboard } from "../api";

// import ChangePasswordModal from "../components/ChangePasswordModal";

export default function Dashboard() {
  const barRef = useRef(null);
  const pieRef = useRef(null);

  const [data, setData] = useState(null); 

  // const [showModal, setShowModal] =
  // useState(
  //   localStorage.getItem(
  //     "showPasswordModal"
  //   ) === "true"
  // );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboard(); 
        console.log(res.data);
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);


  console.log("Token:", localStorage.getItem("token"));


  
  useEffect(() => {
  if (!data) return; // WAIT FOR DATA

  const barChart = new Chart(barRef.current, {
    type: "bar",
    data: {
      labels: ["IT", "HR", "Finance", "Design"],
      datasets: [
        {
          label: "Employees",
          data: data.departmentData || [], //DYNAMIC
          backgroundColor: "#00b3bd",
          borderRadius: 2,
        },
      ],
    },
  });

  const pieChart = new Chart(pieRef.current, {
    type: "doughnut",
    data: {
      labels: ["Salary", "Bonus", "Tax"],
      datasets: [
        {
          data: [
            data.payData?.salary,
            data.payData?.bonus,
            data.payData?.tax,
          ], 
          backgroundColor: ["#00b3bd", "#3b82f6", "#ef476f"],
        },
      ],
    },
  });

  return () => {
    barChart.destroy(); // 🆕 CLEANUP
    pieChart.destroy();
  };
}, [data]);

const stats = [
  {
    title: "Total Employee",
    value: data?.stats?.totalEmployees || 0,
    icon: HiOutlineUsers,
  },
  {
    title: "New Employee",
    value: data?.stats?.newEmployees || 0,
    icon: IoPersonAddOutline,
  },
  {
    title: "On Leave",
    value: data?.stats?.onLeave || 0,
    icon: MdOutlinePersonOff,
  },
  {
    title: "Total Employee",
    value: data?.stats?.totalEmployees || 0,
    icon: IoPersonOutline,
  },
];

// {
//   showModal && (
//     <ChangePasswordModal
//       onClose={() =>
//         setShowModal(false)
//       }
//     />
//   );
// }

  return (

    <div className="flex h-screen bg-[#eef1f5]">
    

      <div className="flex-1 flex flex-col">
        {/* NAVBAR */}
       
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Dashboard</h2>

          <div className="grid grid-cols-4 gap-4">
            {stats.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow px-4 py-3 flex items-center gap-4"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#00b3bd] text-white text-lg">
                    <Icon />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{item.value}</h3>
                    <p className="text-xs text-gray-500">{item.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="col-span-2 bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium mb-2">Employee Structure</h3>
              <canvas ref={barRef}></canvas>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium mb-2">Company Pay</h3>
              <div className="h-[300px] flex items-center justify-center">
                <canvas ref={pieRef}></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}



















































