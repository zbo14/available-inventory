(defun get-avail (in out day)
  (let ((rev (- (length in) day)))
       (- (+ (nth day in)
             (get-reserved (nthcdr rev (reverse out)) (nthcdr rev (reverse in))))
          (nth day out)
          (get-reserved (nthcdr (1+ day) in) (nthcdr (1+ day) out)))))

(defun get-reserved (in out)
  (cond ((null (car in)) 0)
        (t (carry-on (car in) (car out)
                     (get-reserved (cdr in) (cdr out))))))

(defun carry-on (in out cont)
  (max 0
       (min out (+ (- out in) cont))))


;;; for testing

(setq incoming '(3 1 2 3 4 2))
(setq outgoing '(1 2 0 1 5 1))

(setq result (get-avail incoming outgoing 4))
(print result)