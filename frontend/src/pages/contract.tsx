import { useEffect, useState } from "react";
import {
  useCurrentDocId,
  useContentToShow,
  useContractSelected,
} from "../store";
// import DocxImporter from "../components/docxImporter";
import { useAuth } from "../context/AuthContext";
// import DocxImporter from "../components/docxImporter";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { Trash2 } from "lucide-react";
import { toast } from 'react-toastify';
import { DocumentUserAccess } from "../store";

interface Contract {
  id: string;
  name: string;
  language: string;
  version: string;
  created_at: string;
  updated_at: string;
  status: string;
  is_template: boolean;
  shared_with: DocumentUserAccess[];
  business_id: string;
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
  const [isLoading, setIsLoading] = useState(false);
  const [allContract, setAllContract] = useState<Contract[]>([]);
  const [baseData, setBaseData] = useState({
    name: "",
    version: "",
    template: "",
  });
  const [templateContracts, setTemplateContracts] = useState<Contract[]>([]);

  const notifyDuplicate = () => {
    toast.error('Error: Document already existed!', {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
    }

    const toastError = () => {
      toast.error('Error: Something went wrong!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }

  const notifySuccess = (event: any) => {
    toast.success(`Success: ${event} document!`, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  }

  const openModalAdd = () => setAddOpen(true);
  const closeModalAdd = () => {
    setAddOpen(false);
    fetchContracts();
  };

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission

    setIsLoading(true);
    try {
      if (!userInfo?.email) {
        alert("Please login!");
        return navigate("/");
      }

      let response = null;

      console.log(baseData.template)

      if (baseData.template) {
        response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/tinymce/documents/templates/${baseData.template}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "business-id": userInfo?.email,
            },
            body: JSON.stringify({
              name: baseData.name,
              created_by: userInfo?.displayName,
              status: "DRAFT",
              version: baseData.version,
            }),
          }
        );
      } else {
        response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/tinymce/documents`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "business-id": userInfo?.email,
            },
            body: JSON.stringify({
              name: baseData.name,
              created_by: userInfo?.displayName,
              status: "DRAFT",
              version: baseData.version,
              is_templlate: false,
              content: "",
            }), // Send the form data as JSON
          }
        );
      }

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      
      notifySuccess('Creating')
      
      let result = await response.json();
      useCurrentDocId.setState({ id: result?.id });
      useContentToShow.setState({ content: "editor" }); // Set content to show
      useContractSelected.setState({
        created: new Date(result?.created_at),
        name: result?.name,
        status: result?.status,
        version: result?.version,
        shared_with: result?.shared_with,
        is_template: result?.is_template,
        business_id: result?.business_id
      });
      setIsLoading(false);
    } catch (error) {
      toastError()
      console.error("Error:", error);
      notifyDuplicate()
      setIsLoading(false);
    }
  };

  const fetchContracts = async () => {
    try {
      if (!userInfo?.email) {
        alert("Please login!");
        return navigate("/");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/tinymce/documents`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "business-id": userInfo?.email,
          },
        }
      ); // Adjust the URL as needed
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const contracts = data.map((contract: any) => ({
        id: contract.id,
        name: contract.name,
        language: contract.language || "EN",
        version: contract.version,
        created_at: contract.created_at,
        updated_at: contract.updated_at,
        status: contract.status,
        is_template: contract.is_template,
        shared_with: contract.shared_with,
        business_id: contract.business_id
      }));
      
      setAllContract(contracts.filter((contract: Contract) => !contract.is_template));
      // Filter and set template contracts
      setTemplateContracts(contracts.filter((contract: Contract) => contract.is_template));
    } catch (error) {
      toastError()
      console.error("Error fetching contracts:", error);
    }
  };

  const deleteContract = (id: string) => {
    setAllContract(
      allContract.filter(contract => contract.id !== id)
    );
  }

  // Call fetchContracts on component mount
  useEffect(() => {
    fetchContracts();
  }, []); // Empty dependency array to run only on mount

  return (
    <div className="flex-1 p-8 pb-40">
      <h1 className="mb-8 text-4xl font-bold">Contracts</h1>
      <div className="flex justify-between items-center mb-5">
        <div className="flex flex-row gap-x-2">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-3xl mr-3 flex flex-row gap-x-2"
            onClick={openModalAdd}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-square-plus-icon lucide-square-plus"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
            Create new
          </button>
          {/* <DocxImporter setAllContract={setAllContract} notifyDuplicate={notifyDuplicate} notifySuccess={notifySuccess} type={'contract'} /> */}
        </div>
        {/* TODO: ENABLE SEARCH FUNCTION */}
        {/* <input
                    type="text"
                    placeholder="Search..."
                    className="border px-3 py-2 rounded bg-white"
                /> */}
      </div>
      <div className="h-[calc(100vh-200px)] overflow-y-auto">
        <ContractList contracts={{ contracts: allContract }} deleteContractFn={deleteContract} />
      </div>

      {addOpen && (
        <div className="fixed inset-0 bg-slate-200 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h2 className="text-xl font-bold mb-4">Create New Document</h2>
            <form
              id="documentForm"
              className="flex flex-col gap-y-2"
              onSubmit={handleSubmit}
            >
              <div className="flex w-full flex-row items-center justify-between gap-x-2">
                <label>Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  onChange={(e) =>
                    setBaseData({ ...baseData, name: e.target.value })
                  }
                  required
                  className="bg-white text-black text-right border rounded-lg p-2 w-48"
                />
              </div>
              <div className="flex w-full flex-row items-center justify-between gap-x-2">
                <label>Version:</label>
                <input
                  type="text"
                  id="version"
                  name="version"
                  onChange={(e) =>
                    setBaseData({ ...baseData, version: e.target.value })
                  }
                  required
                  className="bg-white text-black text-right border rounded-lg p-2 w-48"
                />
              </div>
              <div className="flex w-full flex-row items-center justify-between gap-x-2">
                <label>Choose a template:</label>
                <select
                  id="template"
                  name="template"
                  onChange={(e) => setBaseData({ ...baseData, template: e.target.value })}
                  className="bg-white text-black text-right border rounded-lg p-2 w-48"
                >
                  <option value="">No template</option>
                  {templateContracts.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name} (v{template.version})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-row gap-x-2 mt-4 items-center justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-500 text-white px-4 py-2 rounded-md disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader /> : "Create"}
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

function ContractItem({ contractItem, deleteContractFn }: { contractItem: Contract, deleteContractFn: Function }) {
  const { userInfo } = useAuth();
  const [loadDelete, setLoadDelete] = useState(false);

  const notifyDelete = (event: any) => {
    toast.success(`Success: ${event} document!`, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  }

  const deleteContract = async (id: any) => {
    setLoadDelete(true);
    try {
      if (!userInfo?.email) {
        alert("Please login!");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/tinymce/documents/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "business-id": userInfo?.email,
          },
        }
      ); // Adjust the URL as needed
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      notifyDelete('Deleted');
      setLoadDelete(false);
      deleteContractFn(id);
    } catch (error) {
      const toastError = () => {
        toast.error('Error: Something went wrong!', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      }
      toastError()
      setLoadDelete(false);
      console.log("Error: ", error);
    }
  };

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
      <td
        className="px-4 py-8 text-gray-700 hover:cursor-pointer"
        onClick={() => {
          useCurrentDocId.setState({ id: contractItem.id });
          useContentToShow.setState({ content: "editor" });
          useContractSelected.setState({
            name: contractItem.name,
            version: contractItem.version,
            status: contractItem.status,
            created: new Date(contractItem.created_at),
            shared_with: contractItem.shared_with,
            is_template: contractItem.is_template,
            business_id: contractItem.business_id
          });
        }}
      >
        {contractItem.name}
      </td>
      <td className="px-4 py-8 text-gray-700">
        {contractItem.language ?? "EN"}
      </td>
      <td className="px-4 py-8 text-gray-700">{contractItem.version}</td>
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
      <td className="px-4 py-8">
        <div className="flex flex-row gap-x-2 w-full items-center justify-center">
          {/* <button className="bg-white border rounded-lg border-neutral-400 text-blue-500 hover:underline" onClick={() => useEditContracts.setState({isOpen: !useEditContracts.getState().isOpen})}>Edit</button> */}
          <button
            className="bg-white text-sm border rounded-lg border-neutral-400 text-red-500 hover:underline disabled:pointer-events-none"
            onClick={() => deleteContract(contractItem?.id)}
            disabled={loadDelete}
          >
            {loadDelete ? (
              <Loader />
            ) : (
              <div className="flex flex-row gap-x-2 items-center justify-center">
                <Trash2 className="w-4 h-4" /> Delete
              </div>
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}

function ContractList({ contracts, deleteContractFn }: { contracts: Contracts, deleteContractFn: Function } ) {
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
            <th className="px-4 py-8 text-xs font-bold text-gray-500 uppercase text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {contracts.contracts
            .sort((a: Contract, b: Contract) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // Sort from newest to oldest
            .map((contract: Contract, index: number) => (
              <ContractItem key={index} contractItem={contract} deleteContractFn={deleteContractFn} />
            ))}
        </tbody>
      </table>
    </div>
  );
}
