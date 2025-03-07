import { useEffect, useState } from "react";
import { useCurrentDocId, useContentToShow, useContractSelected } from "../store";
// import DocxImporter from "../components/docxImporter";
import { useAuth } from "../context/AuthContext";
import DocxImporter from "../components/docxImporter";
import { useNavigate } from "react-router-dom";

interface Contract {
  id: string;
  name: string;
  language: string;
  version: string;
  created_at: string;
  updated_at: string;
  status: string;
}

interface Contracts {
  contracts: Contract[];
}

interface ContractItem {
  contract: Contract;
}

function ContractsPage() {
  const { userInfo } = useAuth();
  const [addOpen, setAddOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [allContract, setAllContract] = useState<Contract[]>([])
  const [baseData, setBaseData] = useState({
    name: '',
    version: '',
  })

  const openModalAdd = () => setAddOpen(true);
  const closeModalAdd = () => { 
    setAddOpen(false);
    fetchContracts();
  }

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission
    
    setIsLoading(true)
    try {
      if (!userInfo?.email) {
        alert("Please login!");
        return navigate('/');
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/document`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'business-id': userInfo?.email
        },
        body: JSON.stringify({
          name: baseData.name,
          created_by: userInfo?.displayName,
          status: 'DRAFT',
          version: baseData.version,
          contents: [{"id":"1","type":"p","children":[{"text":"Start typing here..."}]}]
        }), // Send the form data as JSON
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      let result = await response.json();
      useCurrentDocId.setState({ id: result?.document?.id })
      useContentToShow.setState({ content: "editor" }); // Set content to show
      setIsLoading(false)
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false)
    }
  };

  const fetchContracts = async () => {
    try {
      if (!userInfo?.email) {
        alert("Please login!");
        return navigate('/');
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/document`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'business-id': userInfo?.email
        }
      }); // Adjust the URL as needed
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setAllContract(data.map((contract: any) => ({
        id: contract.id,
        name: contract.name,
        language: contract.language || 'EN',
        version: contract.version,
        created_at: contract.created_at,
        updated_at: contract.updated_at,
        status: contract.status
      }))); // Assuming the response contains a 'contracts' array
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  };

  // Call fetchContracts on component mount
  useEffect(() => {
    fetchContracts();
  }, []); // Empty dependency array to run only on mount

  return (
    <div className="flex-1 p-8">
      <h1 className="mb-8 text-4xl font-bold">Contracts</h1>
      <div className="flex justify-between items-center mb-5">
        <div className="flex flex-row gap-x-2">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-3xl mr-3"
            onClick={openModalAdd}
          >
            Create new
          </button>
          <DocxImporter setAllContract={setAllContract} />
        </div>
        {/* TODO: ENABLE SEARCH FUNCTION */}
        {/* <input
                    type="text"
                    placeholder="Search..."
                    className="border px-3 py-2 rounded bg-white"
                /> */}
      </div>
      <ContractList contracts={allContract} />

      {addOpen && (
        <div className="fixed inset-0 bg-slate-200 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h2 className="text-xl font-bold mb-4">Create New Document</h2>
            <form id="documentForm" className="flex flex-col gap-y-2" onSubmit={handleSubmit}>
              <div className="flex w-full flex-row items-center justify-between gap-x-2">
                <label>Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  onChange={(e) => setBaseData({ ...baseData, name: e.target.value })}
                  required
                  className="bg-white text text-black black text-right border rounded-lg p-2"
                />
              </div>
              <div className="flex w-full flex-row items-center justify-between gap-x-2">
                <label>Version:</label>
                <input
                  type="text"
                  id="version"
                  name="version"
                  onChange={(e) => setBaseData({ ...baseData, version: e.target.value })}
                  required
                  className="bg-white text-black text black text-right border rounded-lg p-2"
                />
              </div>
              <div className="flex flex-row gap-x-2 mt-4 items-center justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-green-500 text-white px-4 py-2 rounded-md disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg
                    aria-hidden="true"
                    className="inline w-6 h-6 text-gray-400 animate-spin dark:text-gray-600 fill-white dark:fill-gray-300"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                ) : (
                  "Create"
                )}
              </button>
              <button
                onClick={closeModalAdd}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContractsPage;


function ContractItem({ contractItem }: { contractItem: Contract }) {
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return "bg-blue-100 text-blue-700";
      case "review":
        return "bg-yellow-100 text-yellow-700";
      case "final":
        return "bg-green-100 text-green-700";
      default:
        return "";
    }
  };

  return (
    <tr className="border-b">
      <td className="px-4 py-8 text-gray-700 hover:cursor-pointer" onClick={() => {
        useCurrentDocId.setState({ id: contractItem.id });
        useContentToShow.setState({ content: "editor" });
        useContractSelected.setState({ name: contractItem.name, version: contractItem.version, status: contractItem.status, created: new Date(contractItem.created_at) });
      }}>{contractItem.name}</td>
      <td className="px-4 py-8 text-gray-700">
        {contractItem.language ?? 'EN'}
      </td>
      <td className="px-4 py-8 text-gray-700">
        {contractItem.version}
      </td>
      <td className="px-4 py-8 text-gray-700">
        {new Date(contractItem.created_at).toLocaleString()}
      </td>
      <td className="px-4 py-8 text-gray-700">
        {new Date(contractItem.updated_at).toLocaleString()}
      </td>
      <td className="px-4 py-8 text-gray-700">
        <span
          className={`px-4 py-2 rounded-3xl ${getStatusClass(
            contractItem.status
          )}`}
        >
          {contractItem.status}
        </span>
      </td>
      {/* <td className="px-4 py-8">
        <div className="flex flex-row gap-x-2 w-full items-center justify-center">
          <button className="bg-white border rounded-lg border-neutral-400 text-blue-500 hover:underline" onClick={() => useEditContracts.setState({isOpen: !useEditContracts.getState().isOpen})}>Edit</button>
          <button className="bg-white border rounded-lg border-neutral-400 text-red-500 hover:underline">Delete</button>
        </div>
      </td> */}
    </tr>
  );
}

function ContractList({ contracts }: Contracts) {
  // const contracts: Contract[] = [
  //     { name: 'Draft Service Agreement Apprvd', language: 'EN', version: 'First draft', created: '5 Aug, 10:02AM', updated: 'Today, 08:00AM', status: 'Uploading' },
  //     { name: 'NDA John Doe', language: 'EN', version: 'Draft v1', created: '5 Aug, 10:02AM', updated: 'Today, 08:00AM', status: 'Drafting' },
  //     { name: 'MSA Accounting Vendor Italy', language: 'IT', version: 'v2.2', created: '01 Aug, 08:59AM', updated: 'Aug 2, 11:01AM', status: 'Finalized' },
  // ];

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-8 text-left text-xs font-bold text-gray-500 uppercase">
              Name
            </th>
            <th className="px-4 py-8 text-left text-xs font-bold text-gray-500 uppercase">
              Language
            </th>
            <th className="px-4 py-8 text-left text-xs font-bold text-gray-500 uppercase">
              Version
            </th>
            <th className="px-4 py-8 text-left text-xs font-bold text-gray-500 uppercase">
              Created
            </th>
            <th className="px-4 py-8 text-left text-xs font-bold text-gray-500 uppercase">
              Updated
            </th>
            <th className="px-4 py-8 text-left text-xs font-bold text-gray-500 uppercase">
              Status
            </th>
            {/* <th className="px-4 py-8 text-left text-xs font-bold text-gray-500 uppercase">
              Actions
            </th> */}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {contracts.map((contract, index) => (
            <ContractItem key={index} contractItem={contract} />
          ))}
        </tbody>
      </table>
    </div>
  );
}