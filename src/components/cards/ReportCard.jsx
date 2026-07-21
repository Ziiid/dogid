import { useEffect, useState } from 'react'
import { useLanguage, getReportCategories, getDefaultReportComment } from '../../lib/i18n.jsx'
import PawIcon from './PawIcon.jsx'
import './ReportCard.css'

export const DEFAULT_GRADES = {
  theft: 'F',
  obedience: 'C',
  barking: 'F',
  furniture: 'D',
  social: 'A',
}

const GRADE_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F']

function gradeClass(grade) {
  if (grade === 'A' || grade === 'B') return 'grade-good'
  if (grade === 'C') return 'grade-mid'
  if (grade === 'D' || grade === 'E') return 'grade-low'
  return 'grade-fail'
}

function ReportCard({ dog, photoUri, onGradesChange, onCommentChange }) {
  const { lang, t } = useLanguage()
  const categories = getReportCategories(lang)
  const defaultComment = getDefaultReportComment(lang)
  const [grades, setGrades] = useState({ ...DEFAULT_GRADES, ...dog.reportGrades })
  const [comment, setComment] = useState(dog.reportComment ?? defaultComment)

  useEffect(() => {
    setGrades({ ...DEFAULT_GRADES, ...dog.reportGrades })
  }, [dog.reportGrades])

  useEffect(() => {
    setComment(dog.reportComment ?? defaultComment)
  }, [dog.reportComment, defaultComment])

  function cycleGrade(key) {
    const idx = GRADE_OPTIONS.indexOf(grades[key])
    const next = GRADE_OPTIONS[(idx + 1) % GRADE_OPTIONS.length]
    const updated = { ...grades, [key]: next }
    setGrades(updated)
    onGradesChange(updated)
  }

  function handleCommentBlur() {
    if (comment !== (dog.reportComment ?? defaultComment)) {
      onCommentChange(comment)
    }
  }

  const y = new Date().getFullYear()
  const schoolYear = `${y}/${y + 1}`

  return (
    <div className="report-card">
      <div className="report-header">
        <div className="report-seal">
          <PawIcon className="report-seal-icon" />
        </div>
        <div className="report-header-text">
          <span className="report-doctype">
            {t('reportDocType')} {schoolYear}
          </span>
        </div>
      </div>

      <div className="report-student-row">
        <div className="report-student-info">
          <div className="report-student-line">
            <span className="report-label">{t('reportStudent')}</span>
            <span className="report-value">{dog.name}</span>
          </div>
          <div className="report-student-line">
            <span className="report-label">{t('reportBreed')}</span>
            <span className="report-value">{dog.breed || '—'}</span>
          </div>
          <div className="report-student-line">
            <span className="report-label">{t('reportClass')}</span>
            <span className="report-value">
              {t('reportClassValuePrefix')} {String(y).slice(2)}
            </span>
          </div>
        </div>
        <div className="report-photo">
          {photoUri ? (
            <img src={photoUri} alt={dog.name} />
          ) : (
            <div className="report-photo-placeholder" />
          )}
        </div>
      </div>

      <div className="report-grades">
        {categories.map((cat) => (
          <div className="report-row" key={cat.key}>
            <span className="report-row-label">{cat.label}</span>
            <button
              type="button"
              className={`report-grade ${gradeClass(grades[cat.key])}`}
              onClick={() => cycleGrade(cat.key)}
            >
              {grades[cat.key]}
            </button>
          </div>
        ))}
      </div>

      <div className="report-comment-block">
        <span className="report-label">{t('reportCommentLabel')}</span>
        <textarea
          className="report-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onBlur={handleCommentBlur}
          placeholder={t('reportCommentPlaceholder')}
          rows={3}
        />
      </div>

      <div className="report-footer">
        <div className="report-signature">
          <span className="report-signature-script">{dog.name}</span>
          <span className="report-signature-caption">{t('reportSignatureCaption')}</span>
        </div>
        <div className="report-stamp">
          <PawIcon className="report-stamp-icon" />
          <span>{t('reportApproved')}</span>
        </div>
      </div>
    </div>
  )
}

export default ReportCard
