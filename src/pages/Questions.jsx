import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Loading from "../components/Loading";

const API_BASE_URL = "https://nshopping.runasp.net/api";

const CategoryManager = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state for adding a question
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [categoryId, setCategoryId] = useState(0);
  const [possibleAnswers, setPossibleAnswers] = useState([""]); // Array of answers

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Category/AllCategories`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchQuestions = async (categoryId) => {
    try {
      console.log("Fetching questions for category:", categoryId);

      const response = await fetch(
        `https://nshopping.runasp.net/api/Question/category/${categoryId}`
      );

      if (!response.ok) {
        throw new Error(`No questions found for category ${categoryId}`);
      }

      const data = await response.json();

      if (data.length === 0) {
        console.warn("No questions available for this category.");
        setQuestions([]); // Set an empty array
      } else {
        setQuestions(data); // Update state with questions
      }
    } catch (error) {
      console.error("Error fetching questions:", error.message);
      setQuestions([]); // Ensure state is not undefined
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      fetchQuestions();
    }
  }, [categories]); // Runs after categories are loaded

  const addQuestion = async () => {
    if (!questionText || !questionType) {
      alert("Please fill in all fields");
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/Question/AddQuestion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: questionText,
          questionType: questionType,
          categoryId: Number(categoryId),
          possibleAnswers: possibleAnswers.filter((ans) => ans.trim() !== ""),
        }),
      });

      if (!response.ok) throw new Error("Failed to add Question");

      // Close modal and refresh questions
      setIsAddModalOpen(false);
      fetchQuestions();
    } catch (error) {
      console.error("Error adding question:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='main-container categories'>
      <div className='main-title'>
        <h3>Questions</h3>
      </div>
      <button
        className='btn btn-success mb-3'
        onClick={() => setIsAddModalOpen(true)}
      >
        Add
      </button>
      <div className='table-responsive'>
        <table className='table'>
          <thead>
            <tr>
              <th>#</th>
              <th>Question Name</th>
              <th>Category</th>
              <th>Answers</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan='5' className='text-center'>
                  <Loading />
                </td>
              </tr>
            ) : questions.length > 0 ? (
              questions.map((question, index) => (
                <tr key={question.id}>
                  <td>{index + 1}</td>
                  <td>{question.text}</td>
                  <td>{question.categoryId}</td>
                  <td>{question.possibleAnswers.join(", ")}</td>
                  <td>
                    <button className='btn btn-primary btn-sm me-2'>
                      <i className='fas fa-edit'></i> Edit
                    </button>
                    <button className='btn btn-danger btn-sm'>
                      <i className='fas fa-trash'></i> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='5' className='text-center'>
                  No questions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Question Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title='Add Question'
        onConfirm={addQuestion}
        confirmText={
          isSaving ? (
            <span className='spinner-border spinner-border-sm'></span>
          ) : (
            "Save"
          )
        }
        confirmDisabled={isSaving}
        closeText='Cancel'
      >
        <form>
          <div className='row'>
            <div className='col-md-12 mb-2'>
              <label htmlFor='questionText' className='form-label'>
                Question Text
              </label>
              <input
                type='text'
                className='form-control'
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
            </div>
            <div className='col-md-12 mb-2'>
              <label htmlFor='questionType' className='form-label'>
                Question Type
              </label>
              <input
                type='text'
                className='form-control'
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
              />
            </div>
            <div className='col-md-12 mb-2'>
              <label htmlFor='categoryId' className='form-label'>
                Category ID
              </label>
              <select
                className='form-control'
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value=''>Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-md-12 mb-2'>
              <label className='form-label'>Possible Answers</label>
              {possibleAnswers.map((answer, index) => (
                <div key={index} className='d-flex mb-2'>
                  <input
                    type='text'
                    className='form-control'
                    value={answer}
                    onChange={(e) => {
                      const updatedAnswers = [...possibleAnswers];
                      updatedAnswers[index] = e.target.value;
                      setPossibleAnswers(updatedAnswers);
                    }}
                  />
                  <button
                    type='button'
                    className='btn btn-danger ms-2'
                    onClick={() =>
                      setPossibleAnswers(
                        possibleAnswers.filter((_, i) => i !== index)
                      )
                    }
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button
                type='button'
                className='btn btn-secondary mt-2'
                onClick={() => setPossibleAnswers([...possibleAnswers, ""])}
              >
                Add Answer
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CategoryManager;
