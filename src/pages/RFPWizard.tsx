import React, { useState, useEffect } from 'react';
import { Brain, Upload, FileText, CheckCircle, Edit3, Download, Eye, Loader, AlertCircle, Sparkles, ArrowRight, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useComplianceAgent } from '../context/BedrockAgentProvider';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadDate: string;
}

interface RFPParameters {
  // Product Details
  productType: string;
  productDescription: string;
  intendedUse: string;
  
  // Packaging Requirements
  packagingType: string[];
  materialRequirements: string[];
  volumeRequirements: string;
  shelfLife: string;
  
  // Compliance Requirements
  regulatoryMarkets: string[];
  complianceStandards: string[];
  certificationRequirements: string[];
  
  // Sustainability Goals
  sustainabilityTargets: string[];
  environmentalRequirements: string[];
  
  // Project Parameters
  targetMarkets: string[];
  budgetRange: string;
  timeline: string;
  deliverySchedule: string;
  
  // Quality Requirements
  qualityStandards: string[];
  testingRequirements: string[];
}

interface GeneratedArtifact {
  id: string;
  name: string;
  type: string;
  description: string;
  status: 'generating' | 'ready' | 'approved';
  size?: string;
}

export default function RFPWizard() {
  const [currentStep, setCurrentStep] = useState('upload'); // upload, analysis, review, generation, approval
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [productDetails, setProductDetails] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [rfpParameters, setRfpParameters] = useState<RFPParameters | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedArtifacts, setGeneratedArtifacts] = useState<GeneratedArtifact[]>([]);
  const [projectId, setProjectId] = useState('');
  
  const navigate = useNavigate();
  const complianceAgent = useComplianceAgent();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles: UploadedFile[] = Array.from(files).map((file, index) => ({
        id: `file-${Date.now()}-${index}`,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        type: file.type.includes('pdf') ? 'PDF' : file.type.includes('doc') ? 'DOC' : 'Other',
        uploadDate: new Date().toISOString()
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const analyzeRequirements = async () => {
    if (!productDetails.trim() && uploadedFiles.length === 0) {
      alert('Please provide product details or upload requirement documents');
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep('analysis');

    try {
      const prompt = `Analyze the following pharmaceutical product requirements and generate comprehensive RFP parameters:

Product Details: ${productDetails}
Uploaded Documents: ${uploadedFiles.map(f => f.name).join(', ')}

Please analyze and return detailed parameters for:
1. Packaging requirements (types, materials, volumes, shelf life)
2. Compliance requirements (regulatory markets, standards, certifications)
3. Sustainability goals (environmental targets, green requirements)
4. Project parameters (target markets, budget estimates, timeline)
5. Quality requirements (standards, testing needs)

Format the response as a comprehensive analysis with specific recommendations for each category.`;

      const response = await complianceAgent.invoke({
        prompt,
        sessionId: `rfp-analysis-${Date.now()}`,
        context: { productDetails, uploadedFiles }
      });

      // Simulate AI analysis and parameter extraction
      const mockParameters: RFPParameters = {
        productType: extractProductType(productDetails),
        productDescription: productDetails,
        intendedUse: 'Pharmaceutical packaging and distribution',
        
        packagingType: ['Primary packaging', 'Secondary packaging', 'Tertiary packaging'],
        materialRequirements: ['USP Class VI materials', 'EU food contact approved', 'Barrier properties'],
        volumeRequirements: '1mL to 100mL range',
        shelfLife: '24-36 months',
        
        regulatoryMarkets: ['FDA (US)', 'EMA (EU)', 'Health Canada'],
        complianceStandards: ['ISO 15378', 'EU GMP', 'FDA 21 CFR Part 820'],
        certificationRequirements: ['CE Marking', 'FDA Registration', 'ISO 13485'],
        
        sustainabilityTargets: ['50% recycled content', 'Carbon neutral packaging', 'Biodegradable options'],
        environmentalRequirements: ['REACH compliance', 'RoHS compliance', 'Sustainable sourcing'],
        
        targetMarkets: ['North America', 'Europe', 'Asia Pacific'],
        budgetRange: '$500K - $2M',
        timeline: '6-9 months',
        deliverySchedule: 'Phased delivery over 12 months',
        
        qualityStandards: ['ISO 9001', 'ISO 14001', 'Good Manufacturing Practice'],
        testingRequirements: ['Extractables & Leachables', 'Compatibility testing', 'Stability studies']
      };

      setTimeout(() => {
        setRfpParameters(mockParameters);
        setAnalysisComplete(true);
        setIsAnalyzing(false);
        setCurrentStep('review');
      }, 3000);

    } catch (error) {
      console.error('Analysis error:', error);
      setIsAnalyzing(false);
    }
  };

  const extractProductType = (details: string): string => {
    const lower = details.toLowerCase();
    if (lower.includes('injection') || lower.includes('syringe')) return 'Injectable Products';
    if (lower.includes('tablet') || lower.includes('pill')) return 'Solid Dosage Forms';
    if (lower.includes('liquid') || lower.includes('solution')) return 'Liquid Formulations';
    return 'Pharmaceutical Products';
  };

  const generateArtifacts = async () => {
    if (!rfpParameters) return;

    setIsGenerating(true);
    setCurrentStep('generation');

    const artifacts: GeneratedArtifact[] = [
      {
        id: 'tech-specs',
        name: 'Technical Specifications Document',
        type: 'PDF',
        description: 'Detailed technical requirements and specifications',
        status: 'generating'
      },
      {
        id: 'compliance-matrix',
        name: 'Compliance Requirements Matrix',
        type: 'Excel',
        description: 'Regulatory compliance checklist and requirements',
        status: 'generating'
      },
      {
        id: 'evaluation-criteria',
        name: 'Supplier Evaluation Criteria',
        type: 'Excel',
        description: 'Scoring matrix and evaluation framework',
        status: 'generating'
      },
      {
        id: 'sustainability-guide',
        name: 'Sustainability Requirements Guide',
        type: 'PDF',
        description: 'Environmental and sustainability criteria',
        status: 'generating'
      },
      {
        id: 'rfp-document',
        name: 'Complete RFP Document',
        type: 'PDF',
        description: 'Final RFP ready for distribution',
        status: 'generating'
      }
    ];

    setGeneratedArtifacts(artifacts);

    // Simulate artifact generation
    for (let i = 0; i < artifacts.length; i++) {
      setTimeout(() => {
        setGeneratedArtifacts(prev => prev.map((artifact, index) => 
          index === i 
            ? { ...artifact, status: 'ready', size: `${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 9) + 1} MB` }
            : artifact
        ));
        
        if (i === artifacts.length - 1) {
          setIsGenerating(false);
          setCurrentStep('approval');
          setProjectId(`RFP-${Date.now().toString().slice(-6)}`);
        }
      }, (i + 1) * 1500);
    }
  };

  const updateParameter = (category: keyof RFPParameters, value: any) => {
    if (!rfpParameters) return;
    setRfpParameters(prev => prev ? { ...prev, [category]: value } : null);
  };

  const approveAndFinalize = () => {
    alert(`RFP Project ${projectId} has been created and is ready for supplier distribution!`);
    navigate('/rfp-tracker');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-Powered RFP Generator</h1>
        <p className="text-gray-600">Upload your requirements and let AI create a comprehensive, compliance-ready RFP</p>
      </div>

      {/* Step 1: Upload & Product Details */}
      {currentStep === 'upload' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to AI RFP Generation</h2>
            <p className="text-gray-600">Start by describing your product and uploading any requirement documents</p>
          </div>

          {/* File Upload */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              Upload Project Documents
            </label>
            <p className="text-gray-600 mb-4">
              Upload your project requirements, product specifications, compliance documents, or any relevant files. 
              Our AI will analyze and extract all necessary information to generate your RFP.
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">Upload your project documents</p>
              <p className="text-gray-600 mb-4">Product specs, requirements, compliance docs, reference materials, etc.</p>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </label>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-600">{file.type} • {file.size}</p>
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Details - Optional */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Additional Details & Requirements
              <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
            </label>
            <p className="text-gray-600 mb-3">
              Add any additional context, specific requirements, or details not covered in your uploaded documents.
            </p>
            <textarea
              value={productDetails}
              onChange={(e) => setProductDetails(e.target.value)}
              placeholder="Any additional context, special requirements, target markets, budget constraints, timeline preferences, or other details not in your documents..."
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={analyzeRequirements}
              disabled={uploadedFiles.length === 0}
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
            >
              <Brain className="h-5 w-5 mr-2" />
              Analyze Documents with AI
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
            {uploadedFiles.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Please upload at least one document to proceed
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 2: AI Analysis */}
      {currentStep === 'analysis' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-purple-600 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI is Analyzing Your Requirements</h2>
            <p className="text-gray-600 mb-8">Our AI agent is processing your documents and extracting comprehensive RFP parameters...</p>
            
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Loader className="h-5 w-5 text-blue-600 animate-spin" />
                <span className="text-blue-600 font-medium">Processing...</span>
              </div>
              
              <div className="space-y-3 text-left">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  Analyzing product requirements
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  Extracting compliance standards
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Loader className="h-4 w-4 text-blue-600 animate-spin mr-2" />
                  Generating packaging specifications
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <div className="h-4 w-4 border-2 border-gray-300 rounded-full mr-2"></div>
                  Determining target markets
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <div className="h-4 w-4 border-2 border-gray-300 rounded-full mr-2"></div>
                  Estimating project parameters
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Review Parameters */}
      {currentStep === 'review' && rfpParameters && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Analysis Complete!</h2>
                <p className="text-gray-600">AI has extracted comprehensive parameters. Review and edit as needed.</p>
              </div>
            </div>
          </div>

          {/* Parameter Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
                <Edit3 className="h-4 w-4 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                  <input
                    type="text"
                    value={rfpParameters.productType}
                    onChange={(e) => updateParameter('productType', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Intended Use</label>
                  <input
                    type="text"
                    value={rfpParameters.intendedUse}
                    onChange={(e) => updateParameter('intendedUse', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Packaging Requirements */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Packaging Requirements</h3>
                <Edit3 className="h-4 w-4 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Volume Requirements</label>
                  <input
                    type="text"
                    value={rfpParameters.volumeRequirements}
                    onChange={(e) => updateParameter('volumeRequirements', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shelf Life</label>
                  <input
                    type="text"
                    value={rfpParameters.shelfLife}
                    onChange={(e) => updateParameter('shelfLife', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Compliance Requirements */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Compliance Requirements</h3>
                <Edit3 className="h-4 w-4 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Regulatory Markets</label>
                  <div className="flex flex-wrap gap-2">
                    {rfpParameters.regulatoryMarkets.map((market, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {market}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Standards Required</label>
                  <div className="flex flex-wrap gap-2">
                    {rfpParameters.complianceStandards.map((standard, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {standard}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Project Parameters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Project Parameters</h3>
                <Edit3 className="h-4 w-4 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
                  <input
                    type="text"
                    value={rfpParameters.budgetRange}
                    onChange={(e) => updateParameter('budgetRange', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
                  <input
                    type="text"
                    value={rfpParameters.timeline}
                    onChange={(e) => updateParameter('timeline', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={generateArtifacts}
              className="inline-flex items-center px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-lg"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Generate RFP Artifacts
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Artifact Generation */}
      {currentStep === 'generation' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-purple-600 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating RFP Artifacts</h2>
            <p className="text-gray-600">AI is creating comprehensive documents based on your confirmed parameters...</p>
          </div>

          <div className="space-y-4">
            {generatedArtifacts.map((artifact) => (
              <div key={artifact.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${
                    artifact.status === 'generating' ? 'bg-yellow-100' :
                    artifact.status === 'ready' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {artifact.status === 'generating' ? (
                      <Loader className="h-5 w-5 text-yellow-600 animate-spin" />
                    ) : artifact.status === 'ready' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <FileText className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{artifact.name}</h4>
                    <p className="text-sm text-gray-600">{artifact.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {artifact.status === 'ready' && artifact.size && (
                    <span className="text-sm text-gray-500">{artifact.size}</span>
                  )}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                    artifact.status === 'generating' ? 'bg-yellow-100 text-yellow-800' :
                    artifact.status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {artifact.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 5: Approval */}
      {currentStep === 'approval' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">RFP Generation Complete!</h2>
                  <p className="text-gray-600">Project ID: <span className="font-mono font-medium">{projectId}</span></p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Ready for Distribution</div>
                <div className="text-lg font-bold text-green-600">{generatedArtifacts.length} Artifacts</div>
              </div>
            </div>
          </div>

          {/* Generated Artifacts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Artifacts</h3>
            <div className="space-y-3">
              {generatedArtifacts.map((artifact) => (
                <div key={artifact.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-900">{artifact.name}</h4>
                      <p className="text-sm text-gray-600">{artifact.type} • {artifact.size}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final Actions */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setCurrentStep('review')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Back to Edit
            </button>
            <button
              onClick={approveAndFinalize}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <Send className="h-4 w-4 mr-2 inline" />
              Approve & Send to Suppliers
            </button>
          </div>
        </div>
      )}
    </div>
  );
}