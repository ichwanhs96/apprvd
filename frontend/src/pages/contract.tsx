import { useEffect, useState } from "react";
import { useCurrentDocId, useContentToShow } from "../store";
// import DocxImporter from "../components/docxImporter";
import { useAuth } from "../context/AuthContext";
import DocxImporter from "../components/docxImporter";

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
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/document`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'business-id': 'ichwan@gmail.com'
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
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchContracts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/document`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'business-id': 'ichwan@gmail.com'
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
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Create
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