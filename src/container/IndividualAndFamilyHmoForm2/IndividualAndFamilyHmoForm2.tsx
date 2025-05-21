import classes from "../IndividualAndFamilyHmoForm/IndividualAndFamilyHmoForm.module.css";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import Dropdown from "@/components/Dropdown/Dropdown";
import {
  individualAndFamilyHmoDataTypes,
  modalGenericType,
} from "@/utilities/types";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { inputChangeHandler } from "@/helpers/inputChangeHandler";
import { BLOODGROUPS, GENDERS, GENOTYPES } from "@/utilities/constants";
import { states } from "@/utilities/states";
import { capitalize } from "@mui/material";
import { AuthContext } from "@/context/AuthContext";
import { requestHandler } from "@/helpers/requestHandler";
import { setAllModalsFalse, setModalTrue } from "@/helpers/modalHandlers";
import useError from "@/hooks/useError";
import Modal from "@/components/Modal/Modal";
import SuccessModalBody from "@/components/SuccessModalBody/SuccessModalBody";
import PaymentModalBody from "../PaymentModalBody/PaymentModalBody";
import { projectTime } from "@/helpers/projectTime";

type IndividualAndFamilyHmoForm2Type = {
  data: individualAndFamilyHmoDataTypes;
  setData: Dispatch<SetStateAction<individualAndFamilyHmoDataTypes>>;
};

const IndividualAndFamilyHmoForm2 = ({
  data,
  setData,
}: IndividualAndFamilyHmoForm2Type) => {
  // States
  const [state, setState] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [genotype, setGenoType] = useState("");

  const [dataFormData, setDataFormdata] = useState(new FormData());
  const [requestState, setRequestState] = useState({
    isLoading: false,
    data: null,
    error: null,
  });
  const [modals, setModals] = useState<modalGenericType>({
    payment: false,
    success: false,
    insuranceSuccess: false,
  });

  //   Context
  const { user } = useContext(AuthContext);

  //   Hooks
  const { errorFlowFunction } = useError();

  //   Utils
  const individualAndFamilyHmoSubmitHandler = () => {
    requestHandler({
      url: "/policies/policy/health-insurance/individual-and-family-hmo",
      isMultipart: true,
      method: "POST",
      id: "submit-form",
      data: dataFormData,
      state: requestState,
      setState: setRequestState,
      successFunction(res) {
        setModalTrue(setModals, "insuranceSuccess");

        setData((prevState) => {
          return {
            ...prevState,
            genotype: "",
            bloodGroup: "",
            weight: "",
            height: "",
          };
        });

        setGender("");
        setState("");
        setGenoType("");
        setBloodGroup("");
      },
      errorFunction(err) {
        errorFlowFunction(err);
      },
    });
  };

  //   Effects
  useEffect(() => {
    if (state) {
      setData((prevState) => {
        return { ...prevState, state };
      });
    }

    if (gender) {
      setData((prevState) => {
        return { ...prevState, gender };
      });
    }

    if (bloodGroup) {
      setData((prevState) => {
        return { ...prevState, bloodGroup };
      });
    }

    if (genotype) {
      setData((prevState) => {
        return { ...prevState, genotype };
      });
    }
  }, [state, gender, bloodGroup, genotype]);

  useEffect(() => {
    const subDataFormData = new FormData();

    subDataFormData.append("firstName", data?.firstName);
    subDataFormData.append("lastName", data?.lastName);
    subDataFormData.append("email", data?.email);
    subDataFormData.append("phone", data?.phone);
    subDataFormData.append("state", data?.state);
    subDataFormData.append("address", data?.address);
    subDataFormData.append("startDate", data?.startDate);
    subDataFormData.append("endDate", data?.endDate);
    subDataFormData.append("gender", data?.gender);
    subDataFormData.append("occupation", data?.occupation);
    subDataFormData.append("genotype", data?.genotype);
    subDataFormData.append("bloodGroup", data?.bloodGroup);
    subDataFormData.append("height", data?.height);
    subDataFormData.append("weight", data?.weight);
    subDataFormData.append("plan", data?.plan);

    setDataFormdata(subDataFormData);
  }, [data]);

  useEffect(() => {
    if (data?.startDate) {
      const endDate = projectTime(data?.startDate, 1, "year");
      setData((prevState: individualAndFamilyHmoDataTypes) => {
        return { ...prevState, endDate };
      });
    }
  }, [data?.startDate]);

  useEffect(() => {
    if (user) {
      setData((prevState) => {
        return {
          ...prevState,
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
          phone: user?.phone,
          state: user?.state,
          address: user?.address,
          occupation: user?.occupation,
          gender: user?.gender,
        };
      });
    }
  }, [user]);

  return (
    <>
      {modals.insuranceSuccess && (
        <Modal
          onClick={() => setAllModalsFalse(setModals)}
          body={
            <SuccessModalBody
              title="Your Insurance Policy has been successfully created!"
              caption="Please pay so we can walk you through the last step of this process"
              onClose={() => setAllModalsFalse(setModals)}
              onClick={() => {
                setAllModalsFalse(setModals);
                setModalTrue(setModals, "payment");
              }}
            />
          }
        />
      )}

      {modals.payment && (
        <Modal
          onClick={() => setAllModalsFalse(setModals)}
          body={
            <PaymentModalBody
              onSuccess={() => {
                setAllModalsFalse(setModals);
                setModalTrue(setModals, "success");
              }}
              data={data as any}
              onClose={() => setAllModalsFalse(setModals)}
              policyType="health-insurance"
              policySubType="individual-and-family-hmo"
            />
          }
        />
      )}

      {modals.success && (
        <Modal
          onClick={() => setAllModalsFalse(setModals)}
          body={
            <SuccessModalBody
              title="Your have successfully applied for an Individual & Family HMO Policy!"
              caption="Please check your mail to get your dashboard login details. Make sure you change your temporary password as soon as possible. "
              onClose={() => setAllModalsFalse(setModals)}
              onClick={() => {
                setAllModalsFalse(setModals);
              }}
              buttontext="Okay"
            />
          }
        />
      )}
      <section className={classes.container} id="insurance-form">
        <div className={classes.header}>
          <h4>Health Insurance Form</h4>
          <p>
            Chart Your Path to Better Health with Expert HMO Recommendations.
          </p>
        </div>

        <form>
          <Input
            label="First Name"
            placeholder="Eg: John"
            value={data?.firstName}
            onChange={(e) => inputChangeHandler(e, setData)}
            name="firstName"
            isRequired
          />
          <Input
            label="Last Name"
            placeholder="Eg: Doe"
            value={data?.lastName}
            onChange={(e) => inputChangeHandler(e, setData)}
            name="lastName"
            isRequired
          />
          <Input
            label="Email"
            placeholder="Eg: example@gmail.com"
            type="email"
            value={data?.email}
            onChange={(e) => inputChangeHandler(e, setData)}
            name="email"
            isRequired
          />
          <Input
            label="Phone Number"
            placeholder="+234 12 345 6789"
            value={data?.phone}
            onChange={(e) => inputChangeHandler(e, setData)}
            name="phone"
            isRequired
          />
          <Dropdown
            label="Gender"
            options={GENDERS.map((data) => capitalize(data) as string)}
            title="Select Gender"
            selected={gender || data?.gender}
            setSelected={setGender}
            isRequired
          />
          <Input
            label="Occupation"
            placeholder="Eg: Student"
            value={data?.occupation}
            name="occupation"
            onChange={(e) => inputChangeHandler(e, setData)}
            isRequired
          />
          <Dropdown
            label="State of Residence"
            options={states}
            title="Select State"
            selected={state || data?.state}
            setSelected={setState}
            isRequired
          />
          <Input
            label="Address"
            placeholder="Eg: ABC Close"
            value={data?.address}
            name="address"
            onChange={(e) => inputChangeHandler(e, setData)}
            isRequired
          />

          <Dropdown
            label="Genotype"
            options={GENOTYPES}
            title="Select Genotypes"
            selected={genotype || data?.genotype}
            setSelected={setGenoType}
            isRequired
          />

          <Dropdown
            label="Blood Group"
            options={BLOODGROUPS}
            title="Select Blood Group"
            selected={bloodGroup || data?.bloodGroup}
            setSelected={setBloodGroup}
            isRequired
          />
          <Input
            label="Weight"
            placeholder="Eg: ABC 12kg"
            value={data?.weight}
            name="weight"
            onChange={(e) => inputChangeHandler(e, setData)}
            isRequired
          />
          <Input
            label="Height"
            placeholder="Eg: ABC 12cm"
            value={data?.height}
            name="height"
            onChange={(e) => inputChangeHandler(e, setData)}
            isRequired
          />

          <Input
            label="Start Date"
            name="startDate"
            value={data?.startDate}
            onChange={(e) => inputChangeHandler(e, setData)}
            type="date"
            // min={todaysDate}
            isRequired
          />

          <Input
            label="End Date"
            name="endDate"
            value={data?.endDate}
            onChange={(e) => inputChangeHandler(e, setData)}
            type="date"
            readOnly
            isRequired
          />

          <div>
            <Button
              disabled={
                !data?.firstName ||
                !data?.lastName ||
                !data?.email ||
                !data?.phone ||
                !data?.state ||
                !data?.address ||
                !data?.startDate ||
                !data?.endDate ||
                !data?.gender ||
                !data?.occupation ||
                !data?.genotype ||
                !data?.bloodGroup ||
                !data?.height ||
                !data?.weight ||
                !data?.plan
              }
              loading={requestState?.isLoading}
              onClick={(e) => {
                e.preventDefault();
                individualAndFamilyHmoSubmitHandler();
              }}
            >
              Submit
            </Button>
          </div>
        </form>
      </section>
    </>
  );
};

export default IndividualAndFamilyHmoForm2;
